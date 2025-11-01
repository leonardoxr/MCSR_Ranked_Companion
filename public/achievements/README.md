# Achievement Images

This directory contains images for displaying achievements in the application.

## Directory Structure

Place achievement images in this directory (`public/achievements/`) with the following naming convention (SVG preferred):

-- `best-time.svg` - BestTime achievement
-- `win-streak.svg` - HighestWinStreak achievement
-- `matches-played.svg` - PlayedMatches achievement
-- `playtime.svg` - Playtime achievement
-- `wins.svg` - Wins achievement
-- `season-result.svg` - SeasonOutcome achievement
-- `playoffs-result.svg` - PlayoffsOutcome achievement
-- `summon-wither.svg` - SummonWither achievement
-- `iron-pickless.svg` - IronPickless achievement
-- `oneshot.svg` - Oneshot achievement
-- `overtake.svg` - Overtake achievement
-- `foodless.svg` - Foodless achievement
-- `classic-run.svg` - ClassicRun achievement
-- `netherite.svg` - Netherite achievement
-- `armorless.svg` - Armorless achievement
-- `high-level.svg` - HighLevel achievement
-- `egap-holder.svg` - EgapHolder achievement
-- `iron-hoe.svg` - IronHoe achievement
-- `weekly-race.svg` - WeeklyRace achievement
-- `secret.svg` - Secret achievement

## Image Specifications

- **Format**: SVG (recommended) or PNG
- **Size**: 64x64px to 128x128px (square)
- **Style**: Match Minecraft's aesthetic if possible
- **Background**: Transparent background recommended

## Fallback Behavior

If an image is missing or fails to load, the application will automatically display a fallback Award icon (`Award` from lucide-react).

## Adding New Achievement Images

1. Add the image file to this directory with the appropriate name
2. Update the `ACHIEVEMENT_IMAGES` mapping in `src/lib/utils/achievements.ts` if needed
3. The image will be automatically loaded when the achievement is displayed

