export default function Header() {
    return (
      <header className="w-full px-6 py-4 bg-[#121212] flex items-center justify-between sticky top-0 z-10">
        <input
          type="text"
          placeholder="What do you want to play?"
          className="bg-zinc-800 text-sm px-4 py-2 rounded w-1/2 text-white placeholder-gray-400 focus:outline-none"
        />
  
        <div className="bg-purple-500 w-8 h-8 flex items-center justify-center rounded-full text-white font-bold">
          W
        </div>
      </header>
    );
  }
  
  