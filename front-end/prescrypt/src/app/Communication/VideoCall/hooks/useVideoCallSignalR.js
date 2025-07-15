import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { EstablishVideoSignalRConnection } from "../../service/ChatService";
import { useVideoCall } from "../../VideoCallProvider";

export default function useVideoCallSignalR(userId, userRole) {
  const [videoCallConnection, setVideoCallConnection] = useState(null);
  const { receiveCall } = useVideoCall();

  useEffect(() => {
    const connection = EstablishVideoSignalRConnection(userId);
    setVideoCallConnection(connection);

    if (userRole === "Patient") {
      connection.on("IncomingCall", (data) => {
        receiveCall({
          callerId: data.doctorId,
          callerName: data.fullName,
          roomUrl: data.roomUrl,
        });
      });
    }

    if (userRole === "Doctor") {
      connection.on("CallAccepted", (data) => {
        console.log("Call accepted:", data);
      });
      connection.on("CallRejected", (data) => {
        console.log("Call rejected:", data);
      });
    }

    connection
      .start()
      .then(() => console.log("VideoCall SignalR connected for user:", userId))
      .catch((err) => console.error("SignalR connection failed:", err));

    return () => {
      if (
        connection &&
        connection.state === signalR.HubConnectionState.Connected
      ) {
        connection
          .stop()
          .then(() => console.log("VideoCall Hub Disconnected"))
          .catch((err) => console.error("Error disconnecting VideoCall Hub:", err));
      }
    };
  }, [userId, userRole, receiveCall]);

  return videoCallConnection;
}
