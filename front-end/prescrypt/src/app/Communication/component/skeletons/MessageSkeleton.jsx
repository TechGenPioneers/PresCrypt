"use client";

const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto bg-white">
      {skeletonMessages.map((_, idx) => {
        const isLeft = idx % 2 === 0;

        return (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              isLeft ? "justify-start" : "justify-end"
            }`}
          >
            {/* Avatar */}
            {isLeft && (
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
            )}

            {/* Message bubble container */}
            <div className="space-y-1">
             
              <div
                className={`w-[200px] h-16 bg-gray-300 animate-pulse rounded-lg ${
                  isLeft ? "rounded-bl-none" : "rounded-br-none"
                }`}
              />
            </div>

            {/* Right avatar */}
            {!isLeft && (
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;
