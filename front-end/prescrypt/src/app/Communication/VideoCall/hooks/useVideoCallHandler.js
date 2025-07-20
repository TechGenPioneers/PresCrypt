export default function useVideoCallSignalR(userId, userRole) {
  const [videoCallConnection, setVideoCallConnection] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const connection = EstablishVideoSignalRConnection(userId);
    let isMounted = true;

    const setupConnection = async () => {
      try {
        // Configure reconnection policy
        connection.onreconnecting(() => {
          console.log("SignalR reconnecting...");
        });

        connection.onclose(async (error) => {
          if (isMounted) {
            console.log("SignalR connection closed", error);
            // Implement exponential backoff for reconnection
            await new Promise(resolve => setTimeout(resolve, 5000));
            try {
              await connection.start();
              console.log("Reconnected successfully");
            } catch (err) {
              console.error("Reconnection failed:", err);
            }
          }
        });

        await connection.start();
        console.log("SignalR connected successfully");

        // Join user group
        try {
          await connection.invoke("JoinGroup", userId);
          console.log(`Joined group ${userId}`);
        } catch (invokeError) {
          console.error("Failed to join group:", invokeError);
        }

        if (isMounted) {
          setVideoCallConnection(connection);
        }

        // Setup role-specific handlers
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
        if (isMounted) {
          // Retry with backoff
          setTimeout(setupConnection, 3000);
        }
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      if (connection) {
        connection.off("CallAccepted");
        connection.off("CallRejected");
        connection.stop().catch(err => 
          console.error("Cleanup stop error:", err)
        );
      }
    };
  }, [userId, userRole]);

  return videoCallConnection;
}