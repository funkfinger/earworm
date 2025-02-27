export default function Home() {
  return (
    <div className="min-h-screen bg-[#2A1810] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-yellow-300 to-pink-500 text-transparent bg-clip-text">
            DeWorm
          </h1>
          <p className="text-xl text-yellow-100/80">
            Discover and remove those pesky earworms with the power of music
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#3C2218] p-6 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <h2
                data-testid="feature-identify"
                className="text-pink-400 text-lg font-semibold mb-2"
              >
                Identify
              </h2>
              <p className="text-yellow-100/60">
                Find that tune stuck in your head
              </p>
            </div>
            <div className="bg-[#3C2218] p-6 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
              <h2
                data-testid="feature-listen"
                className="text-yellow-400 text-lg font-semibold mb-2"
              >
                Listen
              </h2>
              <p className="text-yellow-100/60">Play it out of your system</p>
            </div>
            <div className="bg-[#3C2218] p-6 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <h2
                data-testid="feature-move-on"
                className="text-pink-400 text-lg font-semibold mb-2"
              >
                Move On
              </h2>
              <p className="text-yellow-100/60">Free your mind for new music</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
