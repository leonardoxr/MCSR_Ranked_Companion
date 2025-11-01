# Achievement Images

This directory contains images for displaying achievements in the application.

## Directory Structure

Place achievement images in this directory (`public/achievements/`) with the following naming convention:

- `best-time.png` - BestTime achievement
- `win-streak.png` - HighestWinStreak achievement
- `matches-played.png` - PlayedMatches achievement
- `playtime.png` - Playtime achievement
- `wins.png` - Wins achievement
- `season-result.png` - SeasonOutcome achievement
- `playoffs-result.png` - PlayoffsOutcome achievement
- `summon-wither.png` - SummonWither achievement
- `iron-pickless.png` - IronPickless achievement
- `oneshot.png` - Oneshot achievement
- `overtake.png` - Overtake achievement
- `foodless.png` - Foodless achievement
- `classic-run.png` - ClassicRun achievement
- `netherite.png` - Netherite achievement
- `armorless.png` - Armorless achievement
- `high-level.png` - HighLevel achievement
- `egap-holder.png` - EgapHolder achievement
- `iron-hoe.png` - IronHoe achievement
- `weekly-race.png` - WeeklyRace achievement
- `secret.png` - Secret achievement

## Image Specifications

- **Format**: PNG (recommended) or SVG
- **Size**: 64x64px to 128x128px (square)
- **Style**: Match Minecraft's aesthetic if possible
- **Background**: Transparent background recommended

## Fallback Behavior

If an image is missing or fails to load, the application will automatically display a fallback Award icon (`Award` from lucide-react).

## Adding New Achievement Images

1. Add the image file to this directory with the appropriate name
2. Update the `ACHIEVEMENT_IMAGES` mapping in `src/lib/utils/achievements.ts` if needed
3. The image will be automatically loaded when the achievement is displayed

