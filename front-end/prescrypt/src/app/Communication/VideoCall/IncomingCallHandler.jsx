"use client";

import { useCallback } from "react";
export default function useIncomingCallHandler({
  users,
  userId,
  userRole,
  setSelectedUser,
  roomUrl,
  resetCallState,
}) {
  const handleAcceptCall = useCallback(
    (callerData) => {
      if (!callerData?.callerId || !roomUrl) {
        resetCallState();
        return;
      }

      const callerUser =
        users.find((u) => u.receiverId === callerData.callerId) || {
          receiverId: callerData.callerId,
          fullName: callerData.callerName,
          userName: callerData.callerName,
          image: "/profile.png",
        };

      setSelectedUser(callerUser);

      setTimeout(() => {
        const isDoctor = userRole === "Doctor";

        window.dispatchEvent(
          new CustomEvent("startVideoCall", {
            detail: {
              roomUrl,
              otherUserName: isDoctor
                ? `Patient: ${callerUser.fullName}`
                : `Dr. ${callerUser.fullName}`,
              userName: isDoctor
                ? `Dr. ${users.find((u) => u.receiverId === userId)?.fullName || userId}`
                : `${users.find((u) => u.receiverId === userId)?.fullName || userId}`,
            },
          })
        );
      }, 100);

      resetCallState();
    },
    [users, userId, roomUrl, resetCallState, setSelectedUser, userRole]
  );

  const handleRejectCall = useCallback(() => {
    resetCallState();
  }, [resetCallState]);

  return { handleAcceptCall, handleRejectCall };
}
