# Achievement Icons Comparison

This document compares the MCSR Ranked achievements from the official Wiki with the icons available in this project.

## Source

- **Wiki URL**: https://github.com/MCSR-Ranked/Wiki/tree/main/docs/gameplay
- **Documentation**: [achievements.md](https://raw.githubusercontent.com/MCSR-Ranked/Wiki/main/docs/gameplay/achievements.md)
- **Local Icons**: `/public/achievements/`

## Achievement Coverage

### Level Achievements (Progressive) ✅

| Achievement Name | Description | Icon File | Status |
|---|---|---|---|
| Break the Barrier | Tracks fastest completion time (Any to Sub 6 min) | `best-time.svg` | ✅ Available |
| Consistent Wins | Tracks longest winstreak (2 to 25 wins) | `win-streak.svg` | ✅ Available |
| Match Master | Tracks total matches played (1 to 10,000) | `matches-played.svg` | ✅ Available |
| Practice Makes Perfect | Tracks playtime (1 hour to 10,000 hours) | `playtime.svg` | ✅ Available |
| W Collector | Tracks total wins (1 to 10,000 wins) | `wins.svg` | ✅ Available |

### One-Time Achievements ✅

| Achievement Name | Requirement | Icon File | Status |
|---|---|---|---|
| A Limited Diet | Win without eating any food | `foodless.svg` | ✅ Available |
| Classic | Win without entering a bastion | `classic-run.svg` | ✅ Available |
| Farming Time | Win with iron hoe in inventory | `iron-hoe.svg` | ✅ Available |
| GIGACHAD | Win without wearing armor | `armorless.svg` | ✅ Available |
| It Isn't Iron Pick | Win without crafting iron pickaxe | `iron-pickless.svg` | ✅ Available |
| Never. Give. Up. | Reset in End, then win match | `overtake.svg` | ✅ Available |
| Smithing Time | Win with netherite ingot in inventory | `netherite.svg` | ✅ Available |
| Too Many Levels | Win with at least 60 XP levels | `high-level.svg` | ✅ Available |
| Valuable Artifact | Obtain egap, win without consuming | `egap-holder.svg` | ✅ Available |
| Wrong Category | Win after killing the wither | `summon-wither.svg` | ✅ Available |
| You Only Get One Shot | Kill Ender Dragon with single arrow | `oneshot.svg` | ✅ Available |

### Repeatable Achievements ✅

| Achievement Type | Variants | Icon File | Status |
|---|---|---|---|
| Playoffs | Winner, 2nd, 3rd, Participant (season-numbered) | `playoffs-result.svg` | ✅ Available |
| Season Placement | Top 1, 5, 10, 50, 100, 500, 1000 | `season-result.svg` | ✅ Available |
| Weekly Race | Top 1, 5, 10, 15 (count-based) | `weekly-race.svg` | ✅ Available |

### Additional Icons

| Icon File | Purpose |
|---|---|
| `secret.svg` | For secret/hidden achievements |
| `_base.svg` | Template/base icon for reference |

## Downloaded Documentation Images

The following images have been downloaded from the Wiki repository to `/public/docs/gameplay/`:

1. **elo_change.png** (11KB) - Visual explanation of ELO rating changes
2. **example.png** (633KB) - Example gameplay screenshot/documentation
3. **ranks_divisions.png** (12KB) - Ranks and divisions visual reference

## Summary

✅ **All achievements from the MCSR Ranked Wiki are fully covered** with corresponding icon files in the project.

- **Total Level Achievements**: 5/5 covered
- **Total One-Time Achievements**: 11/11 covered
- **Total Repeatable Achievements**: 3/3 covered
- **Additional Support Icons**: 2 (secret, base)

## Icon Specifications

- **Format**: SVG (vector graphics)
- **Naming Convention**: kebab-case matching achievement types
- **Location**: `/public/achievements/`
- **Fallback**: Award icon from lucide-react if image missing

## Next Steps

The project has complete achievement icon coverage. To use these icons in the application:

1. Reference icons using the Next.js Image component or standard img tags
2. Path: `/achievements/{icon-name}.svg`
3. Implement achievement display logic in `src/lib/utils/achievements.ts`
4. Ensure proper error handling with fallback icons

## References

- [MCSR Ranked Wiki - Achievements](https://github.com/MCSR-Ranked/Wiki/blob/main/docs/gameplay/achievements.md)
- [Local Achievement Icons README](../public/achievements/README.md)
