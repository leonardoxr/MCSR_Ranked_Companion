export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-minecraft-diamond to-minecraft-emerald bg-clip-text text-transparent">
          MCSR Ranked Companion
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Track your speedrun statistics, analyze matches, and climb the leaderboard
        </p>
      </section>

      {/* Quick Start Section */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <p className="text-muted-foreground mb-4">
            This is a cross-platform companion app for MCSR Ranked players. Features include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Real-time player statistics and ELO tracking</li>
            <li>Beautiful match history with detailed breakdowns</li>
            <li>Interactive leaderboards with filters</li>
            <li>Head-to-head player comparisons</li>
            <li>Live match viewer</li>
            <li>Achievement showcase</li>
          </ul>
        </div>
      </section>

      {/* Status Section */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">🚧 Under Development</h3>
          <p className="text-sm text-muted-foreground">
            This application is currently being built. Check back soon for updates!
          </p>
        </div>
      </section>
    </div>
  );
}
