"use client";

const ChatListSkeleton = () => {
  const skeletonItems = Array(6).fill(null);

  return (
    <aside className="flex flex-col w-full min-h-screen transition-all duration-200 border-base-300 bg-base-100">
      <div className="w-full p-5 border-b border-base-300">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl">TeleHealth</span>
        </div>

        <div className="w-full mt-3">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-1.5"
          />
        </div>
      </div>

      <div className="w-full py-3 overflow-y-auto space-y-4 px-5">
        {skeletonItems.map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div className="flex-1 space-y-2 hidden md:block">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatListSkeleton;
