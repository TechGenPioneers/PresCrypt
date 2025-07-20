"use client";


const ChatListSkeleton = () => {
  const skeletonItems = Array(6).fill(null);

  return (
    <aside className="flex flex-col w-full min-h-screen transition-all duration-300 bg-base-100 border-r border-[#09424D]">
      {/* Sticky Header */}
      <div className="w-full p-5 border-b border-[#09424D] bg-[#E9FAF2] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#09424D]">TeleHealth</span>
        </div>

        <div className="mt-3">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full p-2 px-3 text-sm bg-white border border-[#09424D]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      {/* Skeleton List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent">
        {skeletonItems.map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-white rounded-lg animate-pulse shadow-sm"
          >
            {/* Avatar placeholder */}
            <div className="w-12 h-12 bg-gray-300 rounded-full shrink-0" />

            {/* Text placeholders */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 bg-gray-300 rounded" />
              <div className="h-3 w-1/3 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatListSkeleton;
