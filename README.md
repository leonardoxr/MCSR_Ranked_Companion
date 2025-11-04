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
- **Desktop**: Tauri (Coming Soon)

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

3. Create a `.env.local` file with the following configuration:

```env
# Google AdSense Configuration (optional)
# Get your publisher ID from https://www.google.com/adsense
# Format: ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX

# Ad Unit Slot IDs (optional)
# Create ad units in your AdSense dashboard and get the slot IDs
# Format: publisher-id/ad-unit-id
# Example: ca-pub-1234567890123456/1234567890
NEXT_PUBLIC_ADSENSE_AD_SLOT_BANNER=your-banner-ad-slot-id
NEXT_PUBLIC_ADSENSE_AD_SLOT_RECTANGLE=your-rectangle-ad-slot-id
NEXT_PUBLIC_ADSENSE_AD_SLOT_SIDEBAR=your-sidebar-ad-slot-id
```

To set up ads:
- Sign up for [Google AdSense](https://www.google.com/adsense)
- Get your publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
- Create ad units in your AdSense dashboard:
  - **Banner ad** (728x90): For banner placements at top of pages
  - **Rectangle ad** (300x250): For in-content placements
  - **Sidebar ad** (160x600): For sidebar placements (optional)
- Copy the ad unit slot IDs and add them to your `.env.local` file
- The ads will automatically appear on all configured pages once the environment variables are set

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

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
- [ ] Tauri integration
- [ ] Desktop optimization
- [ ] Native features
- [ ] Windows/macOS/Linux builds

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
