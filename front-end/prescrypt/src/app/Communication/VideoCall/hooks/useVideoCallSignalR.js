import { useState, useEffect, useRef } from "react";
import { EstablishVideoSignalRConnection } from "../../service/ChatService";
import * as signalR from "@microsoft/signalr";

export default function useVideoCallSignalR(userId, userRole) {
  const [videoCallConnection, setVideoCallConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const connectionRef = useRef(null); // This is the ref we'll use

  useEffect(() => {
    if (!userId) {
      if (
        connectionRef.current &&
        connectionRef.current.state !== signalR.HubConnectionState.Disconnected
      ) {
        connectionRef.current
          .stop()
          .catch((err) =>
            console.error("Cleanup stop error (no userId):", err)
          );
      }
      setVideoCallConnection(null);
      setConnectionStatus("disconnected");
      return;
    }

    const connection = EstablishVideoSignalRConnection(userId);
    connectionRef.current = connection;

    let isMounted = true;
    let isStarting = true;

    const setupConnection = async () => {
      if (connectionRef.current !== connection) return;

      try {
        console.log("Attempting to start SignalR connection...");
        setConnectionStatus("connecting");
        await connection.start();
        isStarting = false;

        if (!isMounted) {
          await connection.stop(); // stop safely if component unmounted
          return;
        }

        console.log("SignalR connected successfully");
        setVideoCallConnection(connection);
        setConnectionStatus("connected");

        await connection.invoke("JoinGroup", userId);
        console.log(`Joined group ${userId}`);

        if (userRole === "Doctor") {
          connection.on("CallAccepted", ({ roomUrl, patientId }) => {
            window.dispatchEvent(
              new CustomEvent("startVideoCall", {
                detail: { roomUrl, otherUserName: patientId },
              })
            );
          });

          // In useVideoCallSignalR.js (use the more complete implementation)
          // In the doctor-specific handlers
          connection.on("CallRejected", (data) => {
            console.log("Doctor received call rejection:", data);
            window.dispatchEvent(
              new CustomEvent("callRejected", {
                detail: {
                  rejectedBy: data.rejectedBy,
                  message:
                    data.message || `Call rejected by ${data.rejectedBy}`,
                  timestamp: data.timestamp,
                },
              })
            );
          });
        }
      } catch (err) {
        console.error("Connection start failed:", err);
        setConnectionStatus("failed");
        isStarting = false;
      }
    };

    setupConnection();

    return () => {
      isMounted = false;

      const conn = connectionRef.current;
      if (conn && conn.state !== signalR.HubConnectionState.Disconnected) {
        if (isStarting) {
          // Wait for connection to finish starting before stopping
          const interval = setInterval(() => {
            if (
              !isStarting &&
              conn.state !== signalR.HubConnectionState.Disconnected
            ) {
              conn
                .stop()
                .then(() => console.log("SignalR stopped safely after start."))
                .catch((err) =>
                  console.error(
                    "Error stopping SignalR connection during cleanup:",
                    err
                  )
                );
              clearInterval(interval);
            }
          }, 200);
        } else {
          conn
            .stop()
            .then(() => console.log("SignalR stopped during cleanup."))
            .catch((err) =>
              console.error(
                "Error stopping SignalR connection during cleanup:",
                err
              )
            );
        }
      }
      connectionRef.current = null;
      setVideoCallConnection(null);
    };
  }, [userId, userRole]);

  return { connection: videoCallConnection, status: connectionStatus };
}
