"use client";

const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
          <div className="chat-image avatar">
            <div className="rounded-full size-10">
              <div className="w-full h-full rounded-full bg-gray-300 animate-pulse" />
            </div>
          </div>

          <div className="mb-1 chat-header">
            <div className="w-16 h-4 bg-gray-300 animate-pulse rounded" />
          </div>

          <div className="p-0 bg-transparent chat-bubble">
            <div className="h-16 w-[200px] bg-gray-300 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
