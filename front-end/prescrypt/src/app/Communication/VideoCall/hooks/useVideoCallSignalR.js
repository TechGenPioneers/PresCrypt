import { useState, useEffect, useRef } from "react"; // Import useRef
import { EstablishVideoSignalRConnection } from "../../service/ChatService";

export default function useVideoCallSignalR(userId, userRole) {
  const [videoCallConnection, setVideoCallConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const connectionRef = useRef(null); // Use a ref to hold the connection instance

  useEffect(() => {
    if (!userId) return;

    const connection = EstablishVideoSignalRConnection(userId);
    connectionRef.current = connection; // Store connection in ref

    let isMounted = true;

    const setupConnection = async () => {
      try {
        setConnectionStatus("connecting");
        
        connection.onreconnecting(() => {
          console.log("SignalR reconnecting...");
          setConnectionStatus("reconnecting");
        });

        connection.onclose(async (error) => {
          if (isMounted) {
            console.log("SignalR connection closed", error);
            setConnectionStatus("disconnected");
            // Only attempt reconnect if it's the current connection
            if (connectionRef.current === connection) { 
              await new Promise(resolve => setTimeout(resolve, 5000));
              try {
                await connection.start();
                setConnectionStatus("connected");
              } catch (err) {
                console.error("Reconnection failed:", err);
                setConnectionStatus("failed");
              }
            }
          }
        });

        await connection.start();
        console.log("SignalR connected successfully");
        setConnectionStatus("connected");

        try {
          await connection.invoke("JoinGroup", userId);
          console.log(`Joined group ${userId}`);
        } catch (invokeError) {
          console.error("Failed to join group:", invokeError);
        }

        if (isMounted) {
          setVideoCallConnection(connection);
        }

        if (userRole === "Doctor") {
          connection.on("CallAccepted", ({ roomUrl, patientId }) => {
            console.log("Call accepted:", { roomUrl, patientId });
            window.dispatchEvent(
              new CustomEvent("startVideoCall", {
                detail: { roomUrl, otherUserName: patientId }
              })
            );
          });

          connection.on("CallRejected", ({ patientId }) => {
            console.log(`Call rejected by ${patientId}`);
          });
        }

      } catch (startError) {
        console.error("Initial connection failed:", startError);
        setConnectionStatus("failed");
        if (isMounted && connectionRef.current === connection) { // Add condition here
          setTimeout(setupConnection, 3000);
        }
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      // Only stop if the connection was actually established or is in the process
      // And it's the current connection instance
      if (connectionRef.current === connection && connection.state !== "Disconnected") {
        connection.off("CallAccepted");
        connection.off("CallRejected");
        connection.stop().catch(err => 
          console.error("Cleanup stop error:", err)
        );
      }
      connectionRef.current = null; // Clear the ref
    };
  }, [userId, userRole]);

  return { connection: videoCallConnection, status: connectionStatus };
}