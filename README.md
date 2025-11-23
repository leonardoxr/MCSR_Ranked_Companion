# MCSR Ranked Companion

A beautiful, fast, and feature-rich cross-platform companion app for MCSR (Minecraft Speedrun) Ranked players.

## Features

- 🏆 **Real-time Player Statistics** - Track ELO ratings, ranks, and performance metrics
- 📊 **Match History** - Detailed breakdowns of all your matches with beautiful visualizations
- 🎯 **Interactive Leaderboards** - Browse and filter global rankings
- ⚔️ **Head-to-Head Comparisons** - Compare your stats with other players
- 🔴 **Live Match Viewer** - Watch ongoing matches in real-time
- 🏅 **Achievement Showcase** - Display your achievements and progress
- 🌱 **Seed Analysis** - Detailed seed information and statistics
- 📈 **Visual Pace Tracking** - LiveSplit-style pace comparison
- 💾 **Offline-First** - Works even without internet connection
- 🌙 **Dark Mode** - Beautiful Minecraft-themed UI with dark mode support

## Tech Stack

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Styling**: Tailwind CSS with Minecraft-themed color palette
- **State Management**: Zustand + TanStack Query (React Query)
- **API**: MCSR Ranked REST API
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Mobile**: Capacitor (Coming Soon)
- **Desktop**: Tauri ✅

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/leonardoxr/MCSR_Ranked_Companion.git
cd MCSR_Ranked_Companion
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

### Desktop App (Tauri)

The app can be built as a native desktop application using Tauri.

#### Prerequisites

- Rust (install from [rustup.rs](https://rustup.rs/))
- System dependencies:
  - **Windows**: Microsoft Visual C++ Build Tools
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: `libwebkit2gtk-4.0-dev`, `build-essential`, `curl`, `wget`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`

#### Development

```bash
# Start Next.js dev server and Tauri app
npm run tauri:dev
```

This will:
1. Start the Next.js development server on `http://localhost:3000`
2. Launch the Tauri desktop app window connected to the dev server

#### Building Desktop App

```bash
# Build for production
npm run tauri:build
```

The built application will be in `src-tauri/target/release/`:
- **Windows**: `.exe` installer and `.msi` installer
- **macOS**: `.app` bundle and `.dmg` installer
- **Linux**: `.deb`, `.AppImage`, and `.rpm` packages

#### Configuration

Tauri configuration is in `src-tauri/tauri.conf.json`. You can customize:
- Window size and properties
- App identifier and metadata
- Build settings
- Bundle configuration

#### Icons

Place your app icons in `src-tauri/icons/`:
- `32x32.png`, `128x128.png`, `128x128@2x.png`
- `icon.icns` (macOS)
- `icon.ico` (Windows)

You can generate icons using tools like [Tauri Icon Generator](https://github.com/tauri-apps/tauri-icon-gen) or any image editing software.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (web)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run tauri:dev` - Start Tauri development (desktop app)
- `npm run tauri:build` - Build desktop app for production

## Project Structure

```
mcsr-companion/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── common/             # Shared components
│   │   ├── player/             # Player-specific components
│   │   ├── match/              # Match components
│   │   ├── leaderboard/        # Leaderboard components
│   │   └── visualizations/     # Charts and graphs
│   ├── lib/                    # Utilities and libraries
│   │   ├── api/                # API client and hooks
│   │   ├── utils/              # Utility functions
│   │   └── stores/             # State management
│   ├── styles/                 # Global styles
│   └── types/                  # TypeScript types
├── public/                     # Static assets
└── docs/                       # Documentation
```

## API Integration

This app uses the [MCSR Ranked API](https://api.mcsrranked.com/). See `MCSR_Ranked_API_Documentation.md` for complete API details.

### Key Endpoints

- `/users/{user}` - Get player profile and statistics
- `/users/{user}/matches` - Get player match history
- `/leaderboard` - Get global leaderboard
- `/live` - Get currently active matches
- `/matches/{id}` - Get detailed match information

## Development Roadmap

### Phase 1: Core Web App ✅
- [x] Project setup and configuration
- [x] API integration layer
- [x] Type definitions
- [x] React Query hooks
- [x] Utility functions
- [x] Basic layout and providers

### Phase 2: Feature Implementation 🚧
- [ ] Player profile page
- [ ] Match history viewer
- [ ] Leaderboard page
- [ ] Live matches feed
- [ ] Search functionality
- [ ] Head-to-head comparisons

### Phase 3: Advanced Features 📋
- [ ] Achievement showcase
- [ ] Seed analysis
- [ ] Visual pace tracking
- [ ] Statistics visualizations
- [ ] Weekly races

### Phase 4: Mobile App 📱
- [ ] Capacitor setup
- [ ] Mobile optimization
- [ ] Native features
- [ ] iOS/Android builds

### Phase 5: Desktop App 💻
- [x] Tauri integration
- [x] Desktop optimization
- [ ] Native features (system notifications, file system access, etc.)
- [x] Windows/macOS/Linux builds

### Phase 6: Polish & Optimization ✨
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Testing suite
- [ ] Documentation

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [MCSR Ranked](https://mcsrranked.com/) for the amazing competitive speedrunning platform
- The MCSR community for their support and feedback
- All contributors who help improve this project

## Links

- [Official MCSR Ranked Website](https://mcsrranked.com/)
- [MCSR Ranked Discord](https://discord.gg/mcsrranked)
- [API Documentation](https://docs.mcsrranked.com/)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)

---

**Built with ❤️ for the MCSR community**
