const mockSongs = [
    {
      title: "Pop Hits",
      artist: "Various",
    },
    {
      title: "Best of Metallica",
      artist: "Metallica",
    },
    {
      title: "80s Classic Hits",
      artist: "Various",
    },
    {
      title: "Best of 2025",
      artist: "Various",
    },
  ];
  
  export default function MusicGrid() {
    if (mockSongs.length === 0) {
      return <p className="text-gray-500 text-lg">No song found</p>;
    }
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {mockSongs.map((song, idx) => (
          <div
            key={idx}
            className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition"
          >
            <div className="h-32 bg-zinc-700 rounded mb-3"></div>
            <h3 className="font-semibold truncate">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
        ))}
      </div>
    );
  }
  