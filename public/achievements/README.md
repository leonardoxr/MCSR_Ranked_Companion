# Achievement Images

This directory contains official achievement images from the [MCSR Ranked Wiki](https://github.com/MCSR-Ranked/Wiki/tree/main/docs/gameplay/img/achievement).

## Source

All images are sourced from the official MCSR Ranked Wiki repository:
- **Repository**: https://github.com/MCSR-Ranked/Wiki
- **Directory**: `docs/gameplay/img/achievement/`
- **Format**: PNG (64x64px Minecraft-style pixel art)

## Image Organization

### Progressive Achievements (Level-Based)

These achievements have 12 levels each, with unique images for each level:

- **Break the Barrier** (BestTime): `break_the_barrier_level_1.png` through `break_the_barrier_level_12.png`
- **Consistent Wins** (HighestWinStreak): `consistent_wins_level_1.png` through `consistent_wins_level_8.png`
- **Match Master** (PlayedMatches): `match_master_level_1.png` through `match_master_level_12.png`
- **Practice Makes Perfect** (Playtime): `practice_makes_perfect_level_1.png` through `practice_makes_perfect_level_12.png`
- **W Collector** (Wins): `w_collector_level_1.png` through `w_collector_level_12.png`

### One-Time Challenge Achievements

Single-image achievements for special challenges:

- `a_limited_diet.png` - Foodless achievement
- `classic.png` - ClassicRun achievement
- `farming_time.png` - IronHoe achievement
- `gigachad.png` - Armorless achievement
- `it_isnt_iron_pick.png` - IronPickless achievement
- `never_give_up.png` - Overtake achievement
- `smithing_time.png` - Netherite achievement
- `too_many_levels.png` - HighLevel achievement
- `valuable_artifact.png` - EgapHolder achievement
- `wrong_category.png` - SummonWither achievement
- `you_only_get_one_shot.png` - Oneshot achievement

### Competitive Achievements (Placement-Based)

#### Playoffs
- `playoffs_1st.png` - 1st place
- `playoffs_2nd.png` - 2nd place
- `playoffs_3rd.png` - 3rd place
- `playoffs_participant.png` - Participant

#### Season Placement
- `season_placement_top_1.png`
- `season_placement_top_5.png`
- `season_placement_top_10.png`
- `season_placement_top_50.png`
- `season_placement_top_100.png`
- `season_placement_top_500.png`
- `season_placement_top_1000.png`

#### Weekly Race
- `weekly_race_top_1.png`
- `weekly_race_top_5.png`
- `weekly_race_top_10.png`
- `weekly_race_top_15.png`

## Image Specifications

- **Format**: PNG
- **Size**: 64x64px (Minecraft pixel art style)
- **Style**: Official MCSR Ranked achievement icons
- **Background**: Transparent

## Usage

Images are automatically loaded by the `getAchievementImage()` function in `src/lib/utils/achievements.ts` based on:
1. Achievement ID (e.g., "BestTime", "Foodless")
2. Achievement level (for progressive achievements)
3. Achievement data (for placement-based achievements)

## Fallback Behavior

If an image is missing or fails to load, the application displays a fallback Award icon from lucide-react.

## Total Images

77 PNG files covering all MCSR Ranked achievements with level and placement variants.
