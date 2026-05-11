# MCSR Ranked API Documentation

Complete documentation for the MCSR Ranked REST API.

## Table of Contents
- [Overview](#overview)
- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Response Codes](#response-codes)
- [Data Objects](#data-objects)
  - [UserProfile](#userprofile)
  - [Achievement](#achievement)
  - [MatchInfo](#matchinfo)
  - [MatchSeed](#matchseed)
  - [Match Types](#match-types)
  - [Match Categories](#match-categories)
  - [UserInfo (Extended)](#userinfo-extended)
  - [UserStatistics](#userstatistics)
  - [WeeklyRaceInfo](#weeklyraceinfo)
  - [LeaderboardUser](#leaderboarduser)
- [User Identification](#user-identification)
- [Endpoints](#endpoints)
  - [Users](#users)
  - [Versus](#versus)
  - [Matches](#matches)
  - [Leaderboards](#leaderboards)
  - [Live](#live)
  - [Weekly Races](#weekly-races)
- [Data Formats](#data-formats)
- [Pagination](#pagination)
- [Error Handling](#error-handling)
- [Community Resources](#community-resources)
- [Usage Examples](#usage-examples)
- [Notes and Limitations](#notes-and-limitations)
- [Advanced Data Types and Specifications](#advanced-data-types-and-specifications)
- [Website Ideas and Use Cases](#website-ideas-and-use-cases)
- [Visual Assets and Image Resources](#visual-assets-and-image-resources)
- [Visual Pace Tracking and Timeline Implementations](#visual-pace-tracking-and-timeline-implementations)

---

## Overview

The MCSR (Minecraft Speedrun) Ranked API provides access to player statistics, match data, leaderboards, and live game information for the MCSR Ranked competitive speedrunning platform.

**Official Documentation**: [https://docs.mcsrranked.com/](https://docs.mcsrranked.com/)

---

## Base URLs

The API can be accessed via two base endpoints:

- `https://api.mcsrranked.com/` **(Recommended)**
- `https://mcsrranked.com/api/`

---

## Authentication

Most endpoints are publicly accessible without authentication. For expanded rate limits, you can request an API key via the MCSR Ranked Discord server.

---

## Rate Limiting

**Default Rate Limit**: 500 requests per 10 minutes (unless otherwise specified)

- Rate limit applies to all endpoints
- Expanded limits available with API key
- Contact MCSR Ranked Discord for API key requests

### Rate Limit Response

When rate limit is exceeded:
```
Status: 429 Too Many Requests
```

---

## Response Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Successful request |
| `400` | Data not found (arrays return empty `[]` instead) |
| `401` | Invalid parameters |
| `429` | Rate limit exceeded |

---

## Data Objects

### UserProfile

Represents a user's profile information.

**Fields**:
- `uuid` (string) - User's Minecraft UUID (without dashes)
- `nickname` (string) - User's display name
- `roleType` (integer) - Supporter tier level (0-3, see below)
- `eloRate` (integer, nullable) - Current ELO rating (null if unranked)
- `eloRank` (integer, nullable) - Current rank position (null if unranked)
- `country` (string, nullable) - ISO 3166-1 alpha-2 country code

**Supporter Tiers (`roleType`)**:
- `0` - None (regular user)
- `1` - Stone supporter
- `2` - Iron supporter
- `3` - Diamond supporter

**Example**:
```json
{
  "uuid": "70eb9286e3e24153a8b37c8f884f1292",
  "nickname": "ExamplePlayer",
  "roleType": 2,
  "eloRate": 1500,
  "eloRank": 42,
  "country": "US"
}
```

---

### Achievement

Represents a user achievement.

**Fields**:
- `id` (integer) - Achievement type identifier
- `date` (integer) - Unix timestamp (seconds) when achieved
- `data` (array) - Additional achievement-specific data
- `level` (integer) - Current achievement level
- `value` (integer, nullable) - Current progression value (for leveling achievements)
- `goal` (integer, nullable) - Target value for next level (for leveling achievements)

**Achievement Types**:

**Progression Achievements** (have `value` and `goal`):
- `BestTime` - Fastest completion time milestone
- `HighestWinStreak` - Longest consecutive wins
- `PlayedMatches` - Total matches played
- `Playtime` - Total time spent in matches
- `Wins` - Total wins achieved

**Competitive Achievements** (seasonal):
- `SeasonOutcome` - Season ranking achievement (data includes season number and rank)
- `PlayoffsOutcome` - Playoffs participation (data includes season number)

**Special Challenge Achievements**:
- `SummonWither` - Successfully summoned the Wither
- `IronPickless` - Completed without iron pickaxe
- `Oneshot` - Perfect run achievement
- `Overtake` - Came from behind to win
- `Foodless` - Completed without eating food
- `ClassicRun` - Traditional speedrun completion
- `Netherite` - Obtained netherite gear
- `Armorless` - Completed without armor
- `HighLevel` - Reached high-level milestone
- `EgapHolder` - Held enchanted golden apple
- `IronHoe` - Used iron hoe achievement

**Community Achievements**:
- `WeeklyRace` - Weekly race participation (data includes count)
- `Secret` - Hidden/special achievements (id and data in payload)

**Example**:
```json
{
  "id": 5,
  "date": 1640995200,
  "data": [],
  "level": 3,
  "value": 75,
  "goal": 100
}
```

**Season Outcome Example**:
```json
{
  "id": 8,
  "date": 1640995200,
  "data": ["5", "12"],
  "level": 1,
  "value": null,
  "goal": null
}
```
*data[0] = season number, data[1] = rank achieved*

---

### MatchInfo

Comprehensive match data structure.

**Fields**:

**Basic Information**:
- `id` (string) - Unique match identifier
- `type` (integer) - Match type (see [Match Types](#match-types))
- `season` (integer) - Season number
- `category` (string) - Speedrun category
- `date` (integer) - Unix timestamp (seconds)

**Participants**:
- `players` (array) - Array of `UserProfile` objects for players
- `spectators` (array) - Array of `UserProfile` objects for spectators

**Match Results**:
- `result` (object):
  - `uuid` (string) - Winner's UUID
  - `time` (integer) - Winning time in milliseconds
- `forfeited` (boolean) - Whether match was forfeited
- `decayed` (boolean) - Whether match was decayed

**Rankings**:
- `rank` (object):
  - `season` (integer) - Season rank
  - `allTime` (integer) - All-time rank

**ELO Changes**:
- `changes` (array) - Array of objects containing:
  - `uuid` (string) - Player UUID
  - `change` (integer) - ELO change amount (+/-)
  - `eloRate` (integer) - New ELO rating

**Seed Information**:
- `seed` (object) - `MatchSeed` object (see below)

**Advanced Fields** (only available via `/matches/{match_id}`):
- `completions` (array) - Completion data
- `timelines` (array) - Match timeline events
- `replayExist` (boolean) - Whether replay is available
- `vod` (string, nullable) - Video on demand URL

**Example**:
```json
{
  "id": "abc123",
  "type": 2,
  "season": 5,
  "category": "Any% Set Seed",
  "date": 1640995200,
  "players": [/* UserProfile objects */],
  "spectators": [],
  "result": {
    "uuid": "70eb9286-e3e2-4153-a8b3-7c8f884f1292",
    "time": 300000
  },
  "forfeited": false,
  "decayed": false,
  "rank": {
    "season": 100,
    "allTime": 500
  },
  "changes": [
    {
      "uuid": "70eb9286-e3e2-4153-a8b3-7c8f884f1292",
      "change": 15,
      "eloRate": 1515
    }
  ],
  "seed": {/* MatchSeed object */}
}
```

---

### MatchSeed

Describes characteristics of a match seed.

**Fields**:
- `id` (string/number) - Minecraft seed value
- `overworldType` (string) - Overworld spawn structure type
- `bastionType` (string) - Type of bastion in the Nether
- `endTowerHeights` (array) - Array of 4 integers representing end tower heights
- `variations` (array) - Array of notable seed characteristics/variations

**Overworld Types**:
- `Village` - Village spawn
- `BuriedTreasure` - Buried treasure spawn
- `Shipwreck` - Shipwreck spawn
- `RuinedPortal` - Ruined portal spawn
- `DesertTemple` - Desert temple spawn

**Bastion Types**:
- `housing` - Housing bastion
- `treasure` - Treasure bastion
- `bridge` - Bridge bastion
- `stables` - Stables bastion

**Common Variations** (partial list):
- `OverworldChestLoot` - Favorable chest loot in overworld (diamond, obsidian, looting sword, golden apple, etc.)
- `BastionChestLoot` - Good bastion chest loot
- `Shipwreck` - Shipwreck variations (full, normal, upside down, sideways)
- `RuinedPortal` - Ruined portal variations (completable with chest obsidian, lava pool)
- `OverworldStructureBiome` - Specific overworld biome advantages
- `BastionBiome` - Bastion biome location
- `FortressBiome` - Fortress biome information
- `StablesGoodGaps` - Stables with good gaps for navigation
- `BastionSmallRamParts` - Small ramparts (easier navigation)
- `BastionMediumRamParts` - Medium ramparts
- `BastionTripleChests` - Three chests in bastion
- `BuriedEndSpawn` - Buried treasure near End portal
- `CagedEndTower` - End tower with cage structure
- `ZeroTower` - Tower at specific position (front, front-center, back, back-center)

**Example**:
```json
{
  "id": "1234567890",
  "overworldType": "Village",
  "bastionType": "housing",
  "endTowerHeights": [10, 12, 8, 15],
  "variations": ["OverworldChestLoot", "StablesGoodGaps"]
}
```

---

### Match Types

| Type ID | Description |
|---------|-------------|
| `1` | Casual |
| `2` | Ranked |
| `3` | Private Room |
| `4` | Event Mode |

---

### Match Categories

Speedrun categories available in MCSR Ranked matches.

**Standard Categories**:
- `Any` - Any% speedrun (standard goal: kill dragon)
- `Custom` - Custom rule set

**Advancement-Based**:
- `AllAdvancements` - Complete all advancements
- `HalfAdvancements` - Complete half of all advancements
- `BrewingAdvancements` - Brewing-related advancements
- `EndAdvancements` - End dimension advancements
- `FarmingAdvancements` - Farming advancements
- `HusbandryAdvancements` - Animal husbandry advancements
- `NetherAdvancements` - Nether dimension advancements
- `RedstoneAdvancements` - Redstone advancements

**Block-Based Challenges**:
- `MineAChunk` - Mine every block in a chunk
- `Duplication` - Duplication glitch category
- `GetDiamonds` - Obtain diamonds
- `GetNetheriteArmor` - Full netherite armor set
- `GetNetheriteTools` - Complete netherite tool set
- `FillLectern` - Fill a lectern challenge
- `GetAllEffects` - Obtain all status effects
- `GetAllSwords` - Craft all sword types
- `GetAllFood` - Obtain all food items
- `AllPortals` - Create all portal types
- `AllWoods` - Collect all wood types

**Combat Challenges**:
- `Kill5UniqueHostileMobs` - Kill 5 different hostile mobs
- `Kill100Mobs` - Kill 100 mobs
- `Kill5Wardens` - Kill 5 Warden mobs
- `KillElderGuardian` - Kill an Elder Guardian
- `KillWarden` - Kill a Warden
- `KillWither` - Summon and kill the Wither

These categories can be combined with match types (Casual, Ranked, etc.) for various game modes.

---

### UserInfo (Extended)

Complete user information returned by `/users/{user}` endpoint.

**Fields** (in addition to UserProfile):

**Timestamps**:
- `firstOnline` (integer) - Unix timestamp of first login
- `lastOnline` (integer) - Unix timestamp of last activity
- `lastRanked` (integer) - Unix timestamp of last ranked match
- `nextDecay` (integer, nullable) - Unix timestamp of next ELO decay (if inactive)

**Statistics**:
- `statistics` (object) - Season and total statistics (see UserStatistics below)

**Connections** (social platforms):
- `connections` (object) - Connected accounts
  - `discord` (object, nullable): `{ "id": "string", "name": "string" }`
  - `twitch` (object, nullable): `{ "id": "string", "name": "string" }`
  - `youtube` (object, nullable): `{ "id": "string", "name": "string" }`

**Achievements**:
- `achievements` (object):
  - `display` (array) - User's showcased achievements
  - `total` (array) - All unlocked achievements

**Season Results**:
- `seasonResult` (object, nullable) - Current season performance
  - `last` (object): `{ "eloRate": int, "eloRank": int, "phasePoints": int }`
  - `highest` (integer) - Highest ELO this season
  - `lowest` (integer) - Lowest ELO this season
  - `phaseInfos` (array) - Performance by phase

---

### UserStatistics

Detailed statistics structure with season and total breakdown.

**Structure**:
```json
{
  "season": {
    "ranked": { /* UserStats */ },
    "casual": { /* UserStats */ }
  },
  "total": {
    "ranked": { /* UserStats */ },
    "casual": { /* UserStats */ }
  }
}
```

**UserStats Fields** (for each mode):
- `bestTime` (integer, nullable) - Best completion time in milliseconds
- `highestWinStreak` (integer) - Longest win streak
- `currentWinStreak` (integer) - Current win streak
- `playedMatches` (integer) - Total matches played
- `playtime` (integer) - Total playtime in milliseconds
- `completionTime` (integer) - Total time spent completing runs
- `forfeits` (integer) - Number of forfeited matches
- `completions` (integer) - Successfully completed matches
- `wins` (integer) - Total wins
- `losses` (integer) - Total losses

---

### WeeklyRaceInfo

Weekly race event information.

**Fields**:
- `id` (integer) - Race ID (1-indexed)
- `seed` (object) - Seed information for all dimensions
  - `overworld` (string) - Overworld seed
  - `nether` (string) - Nether seed
  - `the_end` (string) - End seed
  - `rng` (string) - RNG seed
- `endsAt` (integer) - Unix timestamp when race ends
- `leaderboard` (array) - Array of leaderboard entries
  - `rank` (integer) - Player rank (1-indexed)
  - `player` (object) - UserProfile object
  - `time` (integer) - Completion time in milliseconds
  - `replayExists` (boolean) - Whether replay is available

**Example**:
```json
{
  "id": 42,
  "seed": {
    "overworld": "1234567890",
    "nether": "9876543210",
    "the_end": "5555555555",
    "rng": "1111111111"
  },
  "endsAt": 1640995200,
  "leaderboard": [
    {
      "rank": 1,
      "player": { /* UserProfile */ },
      "time": 540000,
      "replayExists": true
    }
  ]
}
```

---

### LeaderboardUser

User entry in the leaderboard with seasonal performance.

**Fields** (includes all UserProfile fields plus):
- `seasonResult` (object):
  - `eloRate` (integer) - Current ELO
  - `eloRank` (integer) - Current rank
  - `phasePoints` (integer) - Phase points earned

**Example**:
```json
{
  "uuid": "70eb9286e3e24153a8b37c8f884f1292",
  "nickname": "TopPlayer",
  "roleType": 3,
  "eloRate": 2400,
  "eloRank": 1,
  "country": "US",
  "seasonResult": {
    "eloRate": 2400,
    "eloRank": 1,
    "phasePoints": 150
  }
}
```

---

## User Identification

The API accepts multiple formats for user identification:

1. **UUID** (with or without dashes)
   - `70eb9286-e3e2-4153-a8b3-7c8f884f1292`
   - `70eb9286e3e24153a8b37c8f884f1292`

2. **Nickname** (case-insensitive)
   - `ExamplePlayer`
   - `exampleplayer`

3. **Discord ID** (format: `discord.[ID]`)
   - `discord.123456789012345678`

---

## Endpoints

### Users

#### Get User Profile

Retrieve comprehensive user statistics and information.

**Endpoint**: `GET /users/{user}`

**Parameters**:
- `{user}` - User identifier (UUID, nickname, or Discord ID)

**Response**: User profile object containing:
- `uuid` - User UUID
- `nickname` - Display name
- `roleType` - Role type
- `eloRate` - Current ELO rating
- `eloRank` - Current rank
- `country` - Country code
- `records` - Win/loss records by match type

**Example Request**:
```
GET https://api.mcsrranked.com/users/ExamplePlayer
```

**Example Response**:
```json
{
  "uuid": "70eb9286-e3e2-4153-a8b3-7c8f884f1292",
  "nickname": "ExamplePlayer",
  "roleType": 0,
  "eloRate": 1500,
  "eloRank": 42,
  "country": "US",
  "records": {
    "1": {
      "win": 10,
      "lose": 5
    },
    "2": {
      "win": 50,
      "lose": 30
    }
  }
}
```

---

#### Get User Matches

Retrieve match history for a specific user.

**Endpoint**: `GET /users/{user}/matches`

**Parameters**:
- `{user}` - User identifier (UUID, nickname, or Discord ID)

**Query Parameters**:
- `page` (integer, optional) - Page number for pagination (0-indexed)
- `filter` (integer, optional) - Match type filter (see [Match Types](#match-types))
- `count` (integer, optional) - Number of matches to return

**Response**: Array of `MatchInfo` objects

**Example Request**:
```
GET https://api.mcsrranked.com/users/ExamplePlayer/matches?page=0&filter=2&count=20
```

**Example Response**:
```json
[
  {
    "id": "match_123",
    "type": 2,
    "season": 5,
    "members": [/* player data */],
    "winner": "70eb9286-e3e2-4153-a8b3-7c8f884f1292",
    "final_time": 300000,
    "match_date": 1640995200,
    "score_changes": [/* ELO changes */],
    "is_decay": false,
    "forfeit": false
  }
  // ... more matches
]
```

---

#### Get User Achievements

Retrieve achievements for a specific user.

**Endpoint**: `GET /users/{user}/achievements`

**Parameters**:
- `{user}` - User identifier (UUID, nickname, or Discord ID)

**Response**: Array of `Achievement` objects

**Example Request**:
```
GET https://api.mcsrranked.com/users/ExamplePlayer/achievements
```

---

### Versus

#### Get Head-to-Head Statistics

Compare overall statistics between two players.

**Endpoint**: `GET /versus/{user1}/{user2}`

**Parameters**:
- `{user1}` - First user identifier
- `{user2}` - Second user identifier

**Response**: Head-to-head statistics including:
- Total wins for each player
- ELO comparison
- Recent performance

**Example Request**:
```
GET https://api.mcsrranked.com/versus/Player1/Player2
```

---

#### Get Head-to-Head Matches

Retrieve match history between two specific players.

**Endpoint**: `GET /versus/{user1}/{user2}/matches`

**Parameters**:
- `{user1}` - First user identifier
- `{user2}` - Second user identifier

**Query Parameters**:
- `match_type` (integer, optional) - Filter by match type
- `page` (integer, optional) - Page number for pagination
- `count` (integer, optional) - Number of matches to return

**Response**: Array of `MatchInfo` objects for matches between the two players

**Example Request**:
```
GET https://api.mcsrranked.com/versus/Player1/Player2/matches?count=10
```

---

### Matches

#### Get All Matches

Retrieve a list of matches.

**Endpoint**: `GET /matches`

**Query Parameters**:
- `page` (integer, optional) - Page number for pagination
- `filter` (integer, optional) - Match type filter
- `count` (integer, optional) - Number of matches to return
- `type` (integer, optional) - Match type (see [Match Types](#match-types))
- `season` (integer, optional) - Filter by season

**Response**: Array of `MatchInfo` objects

**Example Request**:
```
GET https://api.mcsrranked.com/matches?page=0&count=50&type=2
```

**Example Response**:
```json
[
  {
    "id": "match_123",
    "type": 2,
    "season": 5,
    "date": 1640995200,
    "players": [/* UserProfile objects */],
    "result": {/* match result */}
  }
  // ... more matches
]
```

---

#### Get Match Details

Retrieve detailed information about a specific match.

**Endpoint**: `GET /matches/{match_id}`

**Parameters**:
- `{match_id}` - Unique match identifier

**Response**: Complete `MatchInfo` object with advanced fields:
- `completions` - Completion timeline
- `timelines` - Full match timeline
- `replayExist` - Replay availability
- `vod` - Video link (if available)

**Example Request**:
```
GET https://api.mcsrranked.com/matches/abc123
```

**Example Response**:
```json
{
  "id": "abc123",
  "type": 2,
  "season": 5,
  "category": "Any% Set Seed",
  "date": 1640995200,
  "players": [/* UserProfile objects */],
  "spectators": [],
  "result": {
    "uuid": "70eb9286-e3e2-4153-a8b3-7c8f884f1292",
    "time": 300000
  },
  "completions": [/* completion data */],
  "timelines": [/* timeline events */],
  "replayExist": true,
  "vod": "https://twitch.tv/video/123456"
}
```

---

### Leaderboards

#### Get Global Leaderboard

Retrieve the global leaderboard rankings.

**Endpoint**: `GET /leaderboard`

**Query Parameters**:
- `page` (integer, optional) - Page number for pagination
- `count` (integer, optional) - Number of entries to return
- `season` (integer, optional) - Filter by season

**Response**: Array of leaderboard entries with:
- Player information
- ELO rating
- Rank
- Win/loss record

**Example Request**:
```
GET https://api.mcsrranked.com/leaderboard?count=100
```

**Example Response**:
```json
[
  {
    "rank": 1,
    "uuid": "70eb9286-e3e2-4153-a8b3-7c8f884f1292",
    "nickname": "TopPlayer",
    "eloRate": 2000,
    "wins": 150,
    "losses": 20
  }
  // ... more entries
]
```

---

### Live

#### Get Live Matches

Retrieve currently active matches.

**Endpoint**: `GET /live`

**Response**: Array of ongoing match data

**Example Request**:
```
GET https://api.mcsrranked.com/live
```

**Note**: Specific response structure not fully documented. Returns real-time data about matches currently in progress.

---

### Weekly Races

#### Get Weekly Race Information

Retrieve weekly race events and standings.

**Endpoint**: `GET /weekly-race`

**Query Parameters**:
- `week` (integer, optional) - Specific week number
- `season` (integer, optional) - Season filter

**Response**: Weekly race data including:
- Participants
- Times
- Rankings

**Example Request**:
```
GET https://api.mcsrranked.com/weekly-race
```

**Note**: Specific response structure not fully documented. Returns information about weekly speedrun competitions.

---

## Data Formats

### Timestamps

All timestamps are in **Unix epoch time (seconds)**.

**Example**: `1640995200` represents January 1, 2022, 00:00:00 UTC

### Time Durations

Match times and durations are expressed in **milliseconds**.

**Example**: `300000` = 5 minutes (300,000 ms)

### Country Codes

Country codes follow the **ISO 3166-1 alpha-2** standard.

**Examples**: `US`, `GB`, `CA`, `AU`

---

## Pagination

Endpoints that support pagination use the following pattern:

- `page` parameter is 0-indexed
- Default page size varies by endpoint
- Use `count` parameter to adjust results per page

**Example**:
```
GET /matches?page=0&count=20  // First 20 matches
GET /matches?page=1&count=20  // Next 20 matches (21-40)
```

---

## Error Handling

### Example Error Response

```json
{
  "error": "User not found",
  "status": 400
}
```

### Best Practices

1. Always check response status codes
2. Handle `400` errors (data not found) gracefully
3. Implement exponential backoff for `429` (rate limit) errors
4. Empty arrays are returned instead of `400` for collection endpoints

---

## Community Resources

- **Official Documentation**: [https://docs.mcsrranked.com/](https://docs.mcsrranked.com/)
- **GitHub Organization**: [https://github.com/MCSR-Ranked](https://github.com/MCSR-Ranked)
- **API Documentation Repo**: [https://github.com/MCSR-Ranked/api-docs](https://github.com/MCSR-Ranked/api-docs)

### Community API Wrappers

#### JavaScript/Node.js
- **mcsr-ranked-api** by yorunoken
  - GitHub: [https://github.com/yorunoken/mcsr-ranked-api](https://github.com/yorunoken/mcsr-ranked-api)
  - Install: `npm install mcsr-ranked-api`

#### Rust
- **mcsr-ranked-api-rs** by LeSaRXD
  - GitHub: [https://github.com/LeSaRXD/mcsr-ranked-api-rs](https://github.com/LeSaRXD/mcsr-ranked-api-rs)
  - Full-featured Rust wrapper with strong typing
  - Modular design with feature flags for optional functionality
  - Comprehensive data structures for all API responses
  - Supports blocking and async requests
  - **Features**:
    - `achievements` - Achievement data structures
    - `matches` - Match/game data and history
    - `leaderboards` - Leaderboard queries
    - `variations` - Seed variation analysis
    - `weekly_races` - Weekly race events
    - `serialize` - Serialization support for all types

---

## Usage Examples

### JavaScript (using fetch)

```javascript
// Get user profile
const response = await fetch('https://api.mcsrranked.com/users/ExamplePlayer');
const userData = await response.json();
console.log(`ELO: ${userData.eloRate}, Rank: ${userData.eloRank}`);

// Get user matches
const matchesResponse = await fetch(
  'https://api.mcsrranked.com/users/ExamplePlayer/matches?count=10&filter=2'
);
const matches = await matchesResponse.json();
console.log(`Total matches: ${matches.length}`);

// Get leaderboard
const leaderboardResponse = await fetch(
  'https://api.mcsrranked.com/leaderboard?count=50'
);
const leaderboard = await leaderboardResponse.json();
```

### Python (using requests)

```python
import requests

# Get user profile
response = requests.get('https://api.mcsrranked.com/users/ExamplePlayer')
user_data = response.json()
print(f"ELO: {user_data['eloRate']}, Rank: {user_data['eloRank']}")

# Get user matches with parameters
params = {'count': 10, 'filter': 2}
matches_response = requests.get(
    'https://api.mcsrranked.com/users/ExamplePlayer/matches',
    params=params
)
matches = matches_response.json()
print(f"Total matches: {len(matches)}")

# Get leaderboard
leaderboard_response = requests.get(
    'https://api.mcsrranked.com/leaderboard',
    params={'count': 50}
)
leaderboard = leaderboard_response.json()
```

### cURL

```bash
# Get user profile
curl https://api.mcsrranked.com/users/ExamplePlayer

# Get user matches
curl "https://api.mcsrranked.com/users/ExamplePlayer/matches?count=10&filter=2"

# Get specific match details
curl https://api.mcsrranked.com/matches/abc123

# Get leaderboard
curl "https://api.mcsrranked.com/leaderboard?count=100"
```

---

## Notes and Limitations

1. **Work in Progress**: The API documentation is still being developed. Some endpoints may have incomplete documentation.

2. **Advanced Parameters**: Advanced parameters (completions, timelines, replay data) are only available when querying specific match details via `/matches/{match_id}`.

3. **External Services**: For UUID lookups, some applications use external services like `https://api.minetools.eu/uuid/{user}`.

4. **Caching**: Consider implementing client-side caching to reduce API calls and avoid rate limiting.

5. **API Stability**: While the API is generally stable, endpoints and response structures may change. Check the official documentation for updates.

---

## Advanced Data Types and Specifications

### Type Aliases and Constraints

Understanding the underlying data types helps with validation and proper data handling:

**Numeric Types**:
- `Elo` / `EloRate` - Unsigned 16-bit integer (0-65535) representing ELO rating
- `EloChange` - Signed 16-bit integer (-32768 to 32767) for ELO delta
- `PhasePoints` - Unsigned 16-bit integer (0-65535) for phase points
- `Rank` - Unsigned 32-bit integer (0-4294967295) for leaderboard position
- `Season` - Unsigned 8-bit integer (0-255) for season number
- `Phase` - Unsigned 8-bit integer (0-255) for phase identifier
- `MatchId` - Unsigned 64-bit integer or string for match identifiers
- `WeeklyRaceId` - Unsigned 32-bit integer for race identifiers
- `MinecraftSeed` - Unsigned 64-bit integer or string for seed values

**Time Values**:
- `Time` - Unsigned 64-bit integer representing milliseconds
- `Timestamp` - Unix timestamp in seconds (integer)
- `DateTime` - ISO 8601 formatted string or Unix timestamp

**Identifiers**:
- `UUID` - String format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (32 hex characters, no dashes)
- `Discord Snowflake` - Format: `discord.{id}` where {id} is 17-19 digit number
- `Nickname` - String (case-insensitive for lookups)

### Field Naming Conventions

The API uses camelCase for JSON field names, but some fields have specific mappings:

**Common Field Mappings**:
- `eloRate` → ELO rating value
- `eloRank` → Rank position
- `roleType` → Supporter tier
- `firstOnline` → First login timestamp
- `lastOnline` → Last activity timestamp
- `lastRanked` → Last ranked match timestamp
- `nextDecay` → Next decay timestamp
- `bestTime` → Best completion time
- `highestWinStreak` → Longest win streak
- `currentWinStreak` → Current win streak
- `playedMatches` → Total matches played
- `completionTime` → Time spent in completions
- `replayExists` / `replayExist` → Replay availability flag
- `endsAt` → End timestamp

### Biome Reference Lists

**Overworld Biomes** (for seed variations):
- Badlands, BambooJungle, Beach, BirchForest, CherryGrove, ColdOcean, DarkForest
- DeepColdOcean, DeepDark, DeepFrozenOcean, DeepLukewarmOcean, DeepOcean, Desert
- DripstoneCaves, End, ErodedBadlands, FlowerForest, Forest, FrozenOcean, FrozenPeaks
- FrozenRiver, Grove, IceSpikes, JaggedPeaks, Jungle, LukewarmOcean, LushCaves
- MangroveSwamp, Meadow, MushroomFields, Nether, Ocean, OldGrowthBirchForest
- OldGrowthPineTaiga, OldGrowthSpruceTaiga, Plains, River, Savanna, SavannaPlateau
- SnowyBeach, SnowyPlains, SnowySlopes, SnowyTaiga, SparseJungle, StonyPeaks
- StonyShore, SunflowerPlains, Swamp, Taiga, WarmOcean, WarpedForest, WindsweptForest
- WindsweptGravellyHills, WindsweptHills, WindsweptSavanna, WoodedBadlands

**Nether Biomes**:
- BasaltDeltas, CrimsonForest, NetherWastes, SoulSandValley, WarpedForest

### Chest Loot Types

Items that can appear in valuable chest loot variations:
- `Diamond` - Diamond gems
- `Obsidian` - Obsidian blocks
- `LootingSword` - Sword with Looting enchantment
- `GoldenApple` - Golden apple
- `EnchantedGoldenApple` - Enchanted golden apple (Notch apple)
- `Carrot` - Carrots (for golden carrots)

### Shipwreck Types

- `Full` - Complete shipwreck structure
- `Normal` - Standard orientation
- `UpsideDown` - Inverted shipwreck
- `Sideways` - Rotated 90 degrees

### Ruined Portal Variations

- `Completable` - Portal with enough obsidian in chest to finish frame
- `Lava` - Portal with lava pool nearby

### Zero Tower Positions

End dimension tower positions (0-indexed):
- `0` / `Front` - Front position
- `1` / `FrontCenter` - Front-center position
- `2` / `Back` - Back position
- `3` / `BackCenter` - Back-center position

### Validation Examples

```javascript
// Validate ELO range
function isValidElo(elo) {
  return Number.isInteger(elo) && elo >= 0 && elo <= 65535;
}

// Validate UUID format (without dashes)
function isValidUUID(uuid) {
  return /^[0-9a-f]{32}$/i.test(uuid);
}

// Validate Discord ID format
function isDiscordId(identifier) {
  return /^discord\.\d{17,19}$/.test(identifier);
}

// Parse time in milliseconds to human readable
function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}

// Convert Unix timestamp to Date
function timestampToDate(timestamp) {
  return new Date(timestamp * 1000);
}
```

---

## Website Ideas and Use Cases

Based on community sites like [mcsrrankedtracker.vercel.app](https://mcsrrankedtracker.vercel.app/) and the official stats pages, here are potential features and applications you can build using this API:

### Player Statistics Dashboard

**Core Features**:
- **Profile Overview**
  - Display ELO rating, rank, and country
  - Win/loss records across all match types
  - Achievement showcase with progress tracking
  - Role badges and user status

- **Performance Analytics**
  - ELO progression over time (line chart)
  - Win rate percentages by match type
  - Recent performance trends (last 10/20/50 matches)
  - Peak ELO and rank achievements
  - Season-by-season statistics comparison

- **Match History**
  - Filterable match list (ranked/casual/private/events)
  - Sortable by date, time, ELO change
  - Quick stats: opponent, result, time, ELO +/-
  - Color-coded wins/losses/forfeits
  - Pagination for browsing extensive histories

**API Endpoints Used**:
- `GET /users/{user}` - Profile data
- `GET /users/{user}/matches` - Match history with filters
- `GET /users/{user}/achievements` - Achievement data

**Example Features**:
```javascript
// ELO progression chart
const matches = await fetch('/users/{user}/matches?count=100&filter=2');
const eloHistory = matches.map(m => ({
  date: m.date,
  elo: m.changes.find(c => c.uuid === userUuid).eloRate
}));

// Win rate calculator
const rankedMatches = matches.filter(m => m.type === 2);
const wins = rankedMatches.filter(m => m.result.uuid === userUuid).length;
const winRate = (wins / rankedMatches.length) * 100;
```

---

### Interactive Leaderboards

**Core Features**:
- **Global Rankings**
  - Top 100/500/1000 players display
  - Real-time rank updates
  - Sortable by ELO, wins, win rate
  - Search/filter by country
  - Highlight specific players

- **Season Leaderboards**
  - Historical season data
  - Season-to-season rank changes
  - Top performers per season
  - Season statistics comparison

- **Country Rankings**
  - Regional leaderboards
  - Country vs country comparisons
  - Top players by region

**API Endpoints Used**:
- `GET /leaderboard?count={n}&season={s}` - Leaderboard data

**UI Ideas**:
- Infinite scroll or pagination
- User profile quick-view on hover
- Rank change indicators (↑↓)
- Filtering sidebar (country, season, rank range)
- "Find Me" button to jump to user's position

---

### Head-to-Head Comparisons

**Core Features**:
- **Player Comparison Tool**
  - Side-by-side stat comparison
  - Overall win/loss record between two players
  - ELO comparison with visual charts
  - Average completion times
  - Recent form (last 5-10 matches)

- **Match History Between Players**
  - Complete head-to-head match history
  - Timeline visualization of encounters
  - Win streak tracking
  - Most common outcomes

**API Endpoints Used**:
- `GET /versus/{user1}/{user2}` - Overall H2H stats
- `GET /versus/{user1}/{user2}/matches` - Match history

**Example Implementation**:
```javascript
// Fetch H2H data
const h2h = await fetch('/versus/Player1/Player2');
const matches = await fetch('/versus/Player1/Player2/matches?count=50');

// Display comparison
{
  player1: { wins: h2h.player1_wins, elo: userData1.eloRate },
  player2: { wins: h2h.player2_wins, elo: userData2.eloRate },
  totalMatches: matches.length
}
```

---

### Match Tracker and Analytics

**Core Features**:
- **Live Match Viewer**
  - Display currently active matches
  - Real-time match updates
  - Featured matches (top players)
  - Spectator counts

- **Match Details Page**
  - Comprehensive match breakdown
  - Timeline of events (completions, timelines)
  - Seed information (bastion type, end towers, etc.)
  - VOD integration (if available)
  - Replay availability indicator
  - ELO changes for all participants

- **Match Search and Filtering**
  - Search by players, date range, match type
  - Filter by season, category, outcome
  - Sort by relevance, date, ELO impact

**API Endpoints Used**:
- `GET /live` - Active matches
- `GET /matches/{match_id}` - Detailed match data
- `GET /matches?type={t}&season={s}` - Match browsing

**Advanced Features**:
- Seed statistics (win rates by bastion type)
- Popular seed variations tracking
- Average completion times by seed characteristics
- VOD archive and categorization

---

### Player Search and Discovery

**Core Features**:
- **Smart Search**
  - Search by username, UUID, or Discord ID
  - Autocomplete suggestions
  - Recent searches history
  - Popular player suggestions

- **Player Comparison Lists**
  - Compare 3+ players simultaneously
  - Create custom leaderboards
  - Friend group tracking
  - Favorite players list

**Implementation Example**:
```javascript
// Search with multiple formats
async function searchPlayer(query) {
  // Try as nickname first
  let user = await fetch(`/users/${query}`);

  // If UUID format detected
  if (/^[0-9a-f-]{32,36}$/i.test(query)) {
    user = await fetch(`/users/${query}`);
  }

  // If Discord ID format
  if (query.startsWith('discord.')) {
    user = await fetch(`/users/${query}`);
  }

  return user;
}
```

---

### Statistics and Insights

**Core Features**:
- **Personal Records**
  - Fastest completion times
  - Biggest ELO gains/losses
  - Longest win/loss streaks
  - Most played opponents

- **Achievement Tracking**
  - Visual achievement gallery
  - Progress bars for leveling achievements
  - Rarity indicators (how many players have it)
  - Achievement unlock timeline

- **Meta Analysis**
  - Overall player statistics (total players, matches, etc.)
  - Average ELO by rank
  - Most common match outcomes
  - Peak activity times

**API Endpoints Used**:
- `GET /users/{user}/achievements` - Achievement data
- `GET /users/{user}/matches?count=1000` - Historical data for analysis
- `GET /leaderboard?count=1000` - Population statistics

**Example Analytics**:
```javascript
// Calculate win streaks
function calculateStreaks(matches) {
  let currentStreak = 0;
  let bestStreak = 0;

  matches.forEach(match => {
    if (match.result.uuid === userUuid) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return { current: currentStreak, best: bestStreak };
}
```

---

### Data Visualization Ideas

**Charts and Graphs**:
1. **ELO Progression Line Chart**
   - X-axis: Time (dates)
   - Y-axis: ELO rating
   - Markers for wins/losses
   - Season boundaries highlighted

2. **Win/Loss Pie Charts**
   - Overall record
   - By match type
   - By season

3. **Performance Heatmap**
   - Activity by day of week
   - Win rate by time of day
   - Match frequency calendar

4. **Rank Distribution Histogram**
   - Player count by ELO bracket
   - Your position highlighted
   - Percentile indicators

5. **Head-to-Head Spider Chart**
   - Multiple stat comparison
   - ELO, wins, avg. time, etc.
   - Visual dominance display

**Recommended Libraries**:
- Chart.js
- D3.js
- Recharts (React)
- ApexCharts
- Victory (React Native)

---

### Real-Time Features

**Live Updates**:
- WebSocket integration for live matches
- Real-time leaderboard updates
- Match notifications (favorite players)
- ELO change alerts

**Polling Strategy** (if WebSocket unavailable):
```javascript
// Poll live matches every 30 seconds
setInterval(async () => {
  const liveMatches = await fetch('/live');
  updateLiveMatchesUI(liveMatches);
}, 30000);

// Poll specific user data every 2 minutes
setInterval(async () => {
  const userData = await fetch(`/users/${username}`);
  updateUserStats(userData);
}, 120000);
```

---

### Mobile App Features

**Essential Features for Mobile**:
- Quick stats widget (ELO, rank, W/L)
- Match notifications
- Simplified leaderboard view
- Swipe-based match history
- QR code for profile sharing
- Offline data caching

**Performance Optimization**:
- Implement data caching with service workers
- Use pagination aggressively (10-20 items per page)
- Lazy load images and heavy components
- Cache frequently accessed data (user profiles, leaderboards)

---

### Advanced Use Cases

**Tournament and Event Management**:
- Track event matches (type 4)
- Custom tournament brackets
- Event leaderboards
- Prize pool tracking

**Community Features**:
- Player profiles with custom bios
- Social following system
- Match sharing (generate shareable links)
- Screenshot generation for sharing stats
- Discord bot integration

**Analytics Dashboard**:
- Multi-player tracking (coaches, teams)
- Performance metrics over time
- Comparative analysis tools
- Export to CSV/Excel
- Custom report generation

**Seed Analysis Tools**:
- Seed database with win rates
- Bastion type statistics
- End tower height correlations
- Overworld spawn analysis
- Favorite seed tracking

---

### UI/UX Best Practices

**Performance**:
- Implement request caching (respect rate limits)
- Use pagination for large datasets
- Show loading states
- Handle 400/404 errors gracefully
- Implement retry logic for failed requests

**User Experience**:
- Responsive design (mobile-first)
- Dark mode support (common in gaming communities)
- Accessible color schemes for ranks/stats
- Keyboard navigation
- Fast search with debouncing

**Design Patterns**:
```javascript
// Debounced search
const debouncedSearch = debounce(async (query) => {
  const results = await fetch(`/users/${query}`);
  displayResults(results);
}, 300);

// Cache with expiry
const cache = new Map();
async function fetchWithCache(url, ttl = 60000) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetch(url).then(r => r.json());
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

---

### Example Project Structure

```
mcsr-stats-website/
├── src/
│   ├── components/
│   │   ├── PlayerCard.jsx
│   │   ├── MatchHistory.jsx
│   │   ├── LeaderboardTable.jsx
│   │   ├── EloChart.jsx
│   │   └── LiveMatches.jsx
│   ├── services/
│   │   ├── api.js          // API wrapper
│   │   ├── cache.js        // Caching layer
│   │   └── analytics.js    // Data processing
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Player.jsx      // /player/:username
│   │   ├── Leaderboard.jsx
│   │   ├── Match.jsx       // /match/:matchId
│   │   └── Versus.jsx      // /versus/:p1/:p2
│   └── utils/
│       ├── formatters.js   // Date, time, ELO formatting
│       └── validators.js   // Input validation
├── public/
└── package.json
```

---

## Visual Assets and Image Resources

The MCSR Ranked API doesn't directly provide image URLs in its responses, but player statistics pages and tracking sites use various external services and patterns to display visual content. Here's a comprehensive guide to implementing visual elements for your MCSR Ranked application.

### Player Avatars and Skins

**Minecraft Player Head Rendering Services**:

Since the API provides player UUIDs, you can use these services to fetch player heads/skins:

1. **Crafatar** (Recommended - Official Mojang data)
   ```
   # 3D Head (isometric view)
   https://crafatar.com/avatars/{uuid}?size=128&overlay

   # 2D Face
   https://crafatar.com/avatars/{uuid}?size=128&overlay&default=MHF_Steve

   # Full Body
   https://crafatar.com/renders/body/{uuid}?size=256&overlay

   # Full Skin
   https://crafatar.com/skins/{uuid}
   ```

   **Parameters**:
   - `size` - Image size (8-512 pixels)
   - `overlay` - Include skin overlay layer (hats, jackets)
   - `default` - Fallback skin (MHF_Steve, MHF_Alex)

2. **Minotar**
   ```
   # Avatar
   https://minotar.net/avatar/{uuid}/128

   # Helm (with overlay)
   https://minotar.net/helm/{uuid}/128

   # Body
   https://minotar.net/body/{uuid}/256
   ```

3. **mc-heads.net**
   ```
   # Avatar
   https://mc-heads.net/avatar/{uuid}/128

   # Head (3D)
   https://mc-heads.net/head/{uuid}/128

   # Body
   https://mc-heads.net/body/{uuid}/256
   ```

**Example Implementation**:
```javascript
// Using Crafatar with the API
const userData = await fetch('https://api.mcsrranked.com/users/Feinberg');
const { uuid } = await userData.json();

// Generate avatar URL
const avatarUrl = `https://crafatar.com/avatars/${uuid}?size=128&overlay`;
const bodyUrl = `https://crafatar.com/renders/body/${uuid}?size=256&overlay`;

// HTML
<img src={avatarUrl} alt="Player Avatar" />
```

**Handling Dashed vs Non-dashed UUIDs**:
```javascript
// The API returns UUIDs without dashes, but most services accept both
function formatUUID(uuid) {
  // Add dashes if not present
  if (uuid.length === 32 && !uuid.includes('-')) {
    return uuid.replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      '$1-$2-$3-$4-$5'
    );
  }
  return uuid;
}

// Most services work with either format
const avatarUrl = `https://crafatar.com/avatars/${uuid}`;  // Works with or without dashes
```

---

### Country Flags

Display country flags using the ISO 3166-1 alpha-2 country codes from the API.

**Free Flag APIs**:

1. **FlagCDN**
   ```
   # SVG (vector)
   https://flagcdn.com/{country_code}.svg

   # PNG (various sizes: 16, 24, 32, 48, 64, 128, 256)
   https://flagcdn.com/w80/{country_code}.png

   # WebP
   https://flagcdn.com/w80/{country_code}.webp
   ```

2. **Flagpedia**
   ```
   https://flagpedia.net/data/flags/w580/{country_code}.webp
   ```

3. **Country Flags API**
   ```
   https://countryflagsapi.com/svg/{country_code}
   https://countryflagsapi.com/png/{country_code}
   ```

**Example Implementation**:
```javascript
const userData = await fetch('https://api.mcsrranked.com/users/Feinberg');
const { country } = await userData.json();

// US -> https://flagcdn.com/w40/us.png
const flagUrl = `https://flagcdn.com/w40/${country.toLowerCase()}.png`;

// HTML with fallback
<img
  src={flagUrl}
  alt={country}
  onError={(e) => e.target.style.display = 'none'}
  className="country-flag"
/>
```

---

### Rank Badges and Tier Icons

While not provided directly by the API, you can create custom rank badges based on ELO ratings:

**Common ELO-based Rank Tiers**:
```javascript
const RANK_TIERS = [
  { name: 'Coal', min: 0, max: 600, color: '#3d3d3d' },
  { name: 'Iron', min: 601, max: 900, color: '#d8d8d8' },
  { name: 'Gold', min: 901, max: 1200, color: '#f4d03f' },
  { name: 'Emerald', min: 1201, max: 1500, color: '#2ecc71' },
  { name: 'Diamond', min: 1501, max: 1800, color: '#3498db' },
  { name: 'Netherite', min: 1801, max: 99999, color: '#8b4789' }
];

function getRankTier(eloRate) {
  return RANK_TIERS.find(tier =>
    eloRate >= tier.min && eloRate <= tier.max
  );
}

// Usage
const userData = await fetch('https://api.mcsrranked.com/users/Feinberg');
const { eloRate } = await userData.json();
const tier = getRankTier(eloRate);
console.log(`Rank: ${tier.name}, Color: ${tier.color}`);
```

**Creating Rank Badge Components**:
```jsx
// React component example
function RankBadge({ eloRate }) {
  const tier = getRankTier(eloRate);

  return (
    <div className="rank-badge" style={{ borderColor: tier.color }}>
      <span className="rank-name" style={{ color: tier.color }}>
        {tier.name}
      </span>
      <span className="elo-rating">{eloRate}</span>
    </div>
  );
}
```

**Icon Packs for Minecraft-themed UI**:
- [Minecraft Icon Pack](https://www.flaticon.com/packs/minecraft) - Free icons
- [Font Awesome](https://fontawesome.com/) - Generic icons (crown, trophy, star, etc.)
- Custom SVG icons matching Minecraft's aesthetic

---

### Achievement Icons

For displaying achievements from `/users/{user}/achievements`:

**Achievement ID to Icon Mapping** (example pattern):
```javascript
const ACHIEVEMENT_ICONS = {
  1: '🏆',  // Trophy for first win
  2: '🔥',  // Fire for win streaks
  3: '⚡',  // Lightning for speed records
  4: '👑',  // Crown for rank achievements
  5: '💎',  // Diamond for prestige
  6: '🎯',  // Target for accuracy/consistency
  // Add more based on actual achievement IDs
};

// Or use custom images
const ACHIEVEMENT_IMAGES = {
  1: '/icons/achievements/first-win.png',
  2: '/icons/achievements/win-streak.png',
  3: '/icons/achievements/speed-record.png',
  // etc.
};

function AchievementIcon({ achievementId }) {
  return (
    <img
      src={ACHIEVEMENT_IMAGES[achievementId]}
      alt={`Achievement ${achievementId}`}
      className="achievement-icon"
    />
  );
}
```

**Progress Indicators**:
```jsx
function AchievementProgress({ achievement }) {
  const { value, goal, level } = achievement;
  const progress = (value / goal) * 100;

  return (
    <div className="achievement-progress">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span>{value} / {goal}</span>
      <span className="level">Level {level}</span>
    </div>
  );
}
```

---

### Match Type Icons

Visual indicators for different match types:

```javascript
const MATCH_TYPE_ICONS = {
  1: { icon: '🎮', label: 'Casual', color: '#95a5a6' },
  2: { icon: '⚔️', label: 'Ranked', color: '#e74c3c' },
  3: { icon: '🔒', label: 'Private', color: '#9b59b6' },
  4: { icon: '🎪', label: 'Event', color: '#f39c12' }
};

function MatchTypeIcon({ type }) {
  const matchType = MATCH_TYPE_ICONS[type];

  return (
    <span
      className="match-type-badge"
      style={{ backgroundColor: matchType.color }}
    >
      {matchType.icon} {matchType.label}
    </span>
  );
}
```

---

### Seed Visualization Icons

For displaying seed characteristics from `MatchSeed` objects:

```javascript
const BASTION_ICONS = {
  'housing': '🏘️',
  'stables': '🐴',
  'treasure': '💰',
  'bridge': '🌉'
};

const OVERWORLD_ICONS = {
  'village': '🏘️',
  'shipwreck': '🚢',
  'desert_temple': '🏜️',
  'buried_treasure': '💎'
};

function SeedInfo({ seed }) {
  return (
    <div className="seed-info">
      <span title="Bastion Type">
        {BASTION_ICONS[seed.bastionType]} {seed.bastionType}
      </span>
      <span title="Overworld Structure">
        {OVERWORLD_ICONS[seed.overworldType]} {seed.overworldType}
      </span>
      <span title="End Towers">
        🏰 {seed.endTowerHeights.join(', ')}
      </span>
    </div>
  );
}
```

---

### Social Platform Icons

For displaying connected accounts (Discord, Twitch, YouTube):

**Using Font Awesome or Simple Icons**:
```html
<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Usage -->
<i class="fab fa-discord"></i>
<i class="fab fa-twitch"></i>
<i class="fab fa-youtube"></i>
```

**Or use Simple Icons API**:
```javascript
const SOCIAL_ICONS = {
  discord: 'https://cdn.simpleicons.org/discord/5865F2',
  twitch: 'https://cdn.simpleicons.org/twitch/9146FF',
  youtube: 'https://cdn.simpleicons.org/youtube/FF0000'
};

function SocialLinks({ connections }) {
  return (
    <div className="social-links">
      {connections.discordId && (
        <a href={`https://discord.com/users/${connections.discordId}`}>
          <img src={SOCIAL_ICONS.discord} alt="Discord" width="24" />
        </a>
      )}
      {connections.twitchName && (
        <a href={`https://twitch.tv/${connections.twitchName}`}>
          <img src={SOCIAL_ICONS.twitch} alt="Twitch" width="24" />
        </a>
      )}
      {connections.youtubeId && (
        <a href={`https://youtube.com/channel/${connections.youtubeId}`}>
          <img src={SOCIAL_ICONS.youtube} alt="YouTube" width="24" />
        </a>
      )}
    </div>
  );
}
```

---

### Background and Decorative Images

**Minecraft-themed Backgrounds**:
```css
/* Grass block pattern */
.background-grass {
  background-image: url('https://static.wikia.nocookie.net/minecraft_gamepedia/images/grass_block.png');
  background-repeat: repeat;
  image-rendering: pixelated;
}

/* End portal/void theme */
.background-end {
  background: linear-gradient(135deg, #1a0033 0%, #000000 100%);
}

/* Nether theme */
.background-nether {
  background: linear-gradient(135deg, #5c0000 0%, #2d0000 100%);
}
```

**Particle Effects** (for live matches, celebrations):
- [tsParticles](https://particles.js.org/) - Minecraft-style particle effects
- [Canvas Confetti](https://www.kirilv.com/canvas-confetti/) - Victory celebrations

---

### Chart and Graph Styling

**Minecraft-themed Color Palette**:
```javascript
const MINECRAFT_COLORS = {
  grass: '#7cbd56',
  dirt: '#8b6d47',
  stone: '#7d7d7d',
  diamond: '#4fc3f7',
  emerald: '#2ecc71',
  gold: '#f4d03f',
  redstone: '#e74c3c',
  lapis: '#3498db',
  iron: '#d8d8d8',
  coal: '#3d3d3d',
  netherite: '#8b4789',
  obsidian: '#1a1a2e'
};

// Chart.js configuration
const chartOptions = {
  backgroundColor: MINECRAFT_COLORS.grass,
  borderColor: MINECRAFT_COLORS.diamond,
  pointBackgroundColor: MINECRAFT_COLORS.emerald,
  // etc.
};
```

---

### Loading States and Placeholders

**Skeleton Loaders**:
```jsx
function PlayerCardSkeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  );
}
```

**CSS**:
```css
.skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton-avatar {
  width: 64px;
  height: 64px;
  background: #e0e0e0;
  border-radius: 8px;
}

.skeleton-text {
  height: 16px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: 8px 0;
}
```

---

### Image Optimization Best Practices

1. **Lazy Loading**:
```html
<img
  src={avatarUrl}
  loading="lazy"
  alt="Player Avatar"
/>
```

2. **Responsive Images**:
```html
<img
  srcset="
    https://crafatar.com/avatars/${uuid}?size=64 64w,
    https://crafatar.com/avatars/${uuid}?size=128 128w,
    https://crafatar.com/avatars/${uuid}?size=256 256w
  "
  sizes="(max-width: 640px) 64px, (max-width: 1024px) 128px, 256px"
  src="https://crafatar.com/avatars/${uuid}?size=128"
  alt="Player Avatar"
/>
```

3. **Caching Strategy**:
```javascript
// Service Worker caching
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('crafatar.com')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open('player-avatars').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
```

4. **Fallback Images**:
```jsx
function PlayerAvatar({ uuid, nickname }) {
  const [imgSrc, setImgSrc] = useState(
    `https://crafatar.com/avatars/${uuid}?size=128&overlay`
  );

  const handleError = () => {
    // Fallback to default Steve skin
    setImgSrc('/images/default-avatar.png');
  };

  return (
    <img
      src={imgSrc}
      alt={nickname}
      onError={handleError}
      className="player-avatar"
    />
  );
}
```

---

### Complete Visual Component Example

```jsx
import React from 'react';

function PlayerCard({ username }) {
  const [player, setPlayer] = React.useState(null);

  React.useEffect(() => {
    fetch(`https://api.mcsrranked.com/users/${username}`)
      .then(res => res.json())
      .then(data => setPlayer(data));
  }, [username]);

  if (!player) return <PlayerCardSkeleton />;

  const tier = getRankTier(player.eloRate);
  const avatarUrl = `https://crafatar.com/avatars/${player.uuid}?size=128&overlay`;
  const flagUrl = `https://flagcdn.com/w40/${player.country.toLowerCase()}.png`;

  return (
    <div className="player-card" style={{ borderColor: tier.color }}>
      <img
        src={avatarUrl}
        alt={player.nickname}
        className="player-avatar"
      />
      <div className="player-info">
        <h2>
          {player.nickname}
          <img src={flagUrl} alt={player.country} className="flag" />
        </h2>
        <div className="rank-badge" style={{ backgroundColor: tier.color }}>
          {tier.name}
        </div>
        <div className="stats">
          <span className="elo">{player.eloRate} ELO</span>
          <span className="rank">Rank #{player.eloRank}</span>
        </div>
      </div>
    </div>
  );
}
```

---

### Asset Hosting Recommendations

For custom icons and images:

1. **CDN Services** (free tiers available):
   - [Cloudflare CDN](https://www.cloudflare.com/)
   - [Imgix](https://www.imgix.com/)
   - [Cloudinary](https://cloudinary.com/)

2. **Static Asset Hosting**:
   - GitHub Pages (for open source projects)
   - Vercel/Netlify (automatic CDN)
   - AWS S3 + CloudFront

3. **Image Optimization Tools**:
   - [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
   - [SVGO](https://github.com/svg/svgo) - SVG optimization
   - [Sharp](https://sharp.pixelplumbing.com/) - Node.js image processing

---

### Performance Metrics

**Recommended Image Sizes**:
- Player avatars (list view): 32x32px or 48x48px
- Player avatars (profile page): 128x128px or 256x256px
- Full body renders: 256x256px or 512x512px
- Flag icons: 24x16px or 32x21px
- Achievement icons: 48x48px or 64x64px
- Rank badges: 80x80px or 100x100px

**Loading Budget**:
- Aim for <100KB total images on initial load
- Lazy load below-the-fold images
- Use WebP format where supported
- Implement progressive loading for large images

---

## Visual Pace Tracking and Timeline Implementations

Inspired by community projects like [MCSRPaceWidget](https://github.com/mcrtabot/MCSRPaceWidget), here are proven patterns for building visually engaging pace tracking interfaces for speedrun data.

### Time Formatting Utilities

**Enhanced Time Conversion Functions**:

```javascript
/**
 * Converts time string formats to milliseconds
 * Supports: "1:23:45.678", "23:45.678", "23:45"
 */
function convertTimeToMilliSeconds(timeString) {
  const regex = /^(?:(\d+):)?(\d+):(\d+)(?:\.(\d+))?$/;
  const match = timeString.match(regex);

  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const ms = parseInt((match[4] || '0').padEnd(3, '0').slice(0, 3), 10);

  return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + ms;
}

/**
 * Converts milliseconds to human-readable time format
 * @param {number} milliseconds - Time in milliseconds
 * @param {boolean} suppressMs - Whether to hide milliseconds
 * @returns {string} Formatted time string
 */
function convertMillisecondsToTime(milliseconds, suppressMs = false) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor(milliseconds % 1000);

  const minutesPadded = String(minutes).padStart(2, '0');
  const secondsPadded = String(seconds).padStart(2, '0');
  const msPadded = String(ms).padStart(3, '0');

  if (hours > 0) {
    return suppressMs
      ? `${hours}:${minutesPadded}:${secondsPadded}`
      : `${hours}:${minutesPadded}:${secondsPadded}.${msPadded}`;
  }

  return suppressMs
    ? `${minutes}:${secondsPadded}`
    : `${minutes}:${secondsPadded}.${msPadded}`;
}

/**
 * Formats time with optional sign prefix for pace differences
 */
function formatTimeDifference(milliseconds, showSign = true) {
  const sign = milliseconds >= 0 ? '+' : '-';
  const absTime = convertMillisecondsToTime(Math.abs(milliseconds));

  return showSign ? `${sign}${absTime}` : absTime;
}
```

**Usage with MCSR Ranked API**:

```javascript
// Format match completion time
const match = await fetch('https://api.mcsrranked.com/matches/abc123').then(r => r.json());
const finishTime = convertMillisecondsToTime(match.result.time);
console.log(`Finish: ${finishTime}`); // "5:23.456"

// Compare two match times
const user = await fetch('https://api.mcsrranked.com/users/ExamplePlayer').then(r => r.json());
const bestTime = user.statistics.total.ranked.bestTime;
const currentTime = match.result.time;
const diff = currentTime - bestTime;

console.log(`Pace: ${formatTimeDifference(diff)}`); // "+0:15.234" or "-0:15.234"
```

---

### Pace Comparison Visualization Patterns

**Side-by-Side Timeline Display**:

```jsx
function PaceComparison({ currentMatch, personalBest }) {
  return (
    <div className="pace-container">
      <div className="timeline pb-timeline">
        <h3>Personal Best</h3>
        <Timeline data={personalBest} type="pb" />
      </div>

      <div className="timeline current-timeline">
        <h3>Current Run</h3>
        <Timeline data={currentMatch} type="current" />
      </div>
    </div>
  );
}
```

**Pace Status Color Coding**:

```css
/* CSS Variables for consistent theming */
:root {
  --pace-ahead-color: rgba(128, 255, 128, 1);    /* Green - ahead of PB */
  --pace-behind-color: rgba(255, 128, 128, 1);   /* Red - behind PB */
  --pace-normal-color: rgba(255, 255, 255, 1);   /* White - neutral */
  --pace-highlight-glow: rgba(255, 128, 128, 0.6);
}

/* Highlighted splits (ahead of pace) */
.timeline__item--highlighted {
  color: var(--pace-ahead-color);
  text-shadow: 0 0 5px var(--pace-highlight-glow),
               0 0 10px var(--pace-highlight-glow),
               0 0 15px var(--pace-highlight-glow);
}

/* Behind pace */
.timeline__item--behind {
  color: var(--pace-behind-color);
}

/* Current split */
.timeline__item--current {
  font-weight: bold;
  border-left: 3px solid var(--pace-ahead-color);
  padding-left: 8px;
}

/* Completed splits */
.timeline__item--done {
  opacity: 0.7;
}
```

**Pace Calculation Logic**:

```javascript
function calculatePaceStatus(currentTime, pbTime) {
  if (!currentTime || !pbTime) return 'unknown';

  const difference = currentTime - pbTime;
  const threshold = 1000; // 1 second threshold

  if (difference < -threshold) return 'ahead';
  if (difference > threshold) return 'behind';
  return 'even';
}

function PaceSplit({ split, pbSplit }) {
  const status = calculatePaceStatus(split.time, pbSplit?.time);
  const diff = split.time - (pbSplit?.time || 0);

  return (
    <div className={`timeline__item timeline__item--${status}`}>
      <span className="split-name">{split.name}</span>
      <span className="split-time">
        {convertMillisecondsToTime(split.time)}
      </span>
      {pbSplit && (
        <span className="split-diff">
          {formatTimeDifference(diff)}
        </span>
      )}
    </div>
  );
}
```

---

### Visual Indicators and Animations

**Emotion-Based Status Indicator**:

```jsx
function PaceIndicator({ currentPace, pbPace }) {
  const getEmotionState = () => {
    if (!currentPace || !pbPace) return 'normal';

    const pacePercentage = (currentPace / pbPace) * 100;

    if (pacePercentage < 95) return 'happy';   // >5% ahead
    if (pacePercentage > 105) return 'sad';    // >5% behind
    return 'normal';
  };

  const emotion = getEmotionState();

  return (
    <div className={`pace-indicator pace-indicator--${emotion}`}>
      <div className="indicator-face">
        {emotion === 'happy' && '😊'}
        {emotion === 'normal' && '😐'}
        {emotion === 'sad' && '😞'}
      </div>
      <div className="indicator-text">
        {emotion === 'happy' && 'Ahead of Pace!'}
        {emotion === 'normal' && 'On Pace'}
        {emotion === 'sad' && 'Behind Pace'}
      </div>
    </div>
  );
}
```

**Walking Animation for Active Runner** (Minecraft-style):

```css
@keyframes walk {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.runner-icon {
  width: 48px;
  height: 48px;
  image-rendering: pixelated;
  animation: walk 0.4s steps(2, end) infinite;
}

.runner-icon--moving {
  animation-play-state: running;
}

.runner-icon--stopped {
  animation-play-state: paused;
}
```

**Horizontal Progress Timeline**:

```jsx
function ProgressTimeline({ currentTime, pbTime, milestones }) {
  const progressPercent = Math.min((currentTime / pbTime) * 100, 100);

  return (
    <div className="progress-timeline" style={{ width: '1280px' }}>
      {/* Background PB line */}
      <div className="pb-line" style={{ width: '100%' }} />

      {/* Current progress line */}
      <div
        className="current-line"
        style={{ width: `${progressPercent}%` }}
      />

      {/* Milestone markers */}
      {milestones.map((milestone, idx) => {
        const position = (milestone.time / pbTime) * 100;
        const reached = currentTime >= milestone.time;

        return (
          <div
            key={idx}
            className={`milestone ${reached ? 'milestone--reached' : ''}`}
            style={{ left: `${position}%` }}
          >
            <img
              src={milestone.icon}
              alt={milestone.name}
              className="milestone-icon"
            />
            <span className="milestone-label">{milestone.name}</span>
          </div>
        );
      })}

      {/* Current position indicator */}
      <div
        className="current-position"
        style={{ left: `${progressPercent}%` }}
      >
        <div className="runner-icon" />
      </div>
    </div>
  );
}
```

```css
.progress-timeline {
  position: relative;
  height: 80px;
  margin: 20px 0;
}

.pb-line, .current-line {
  position: absolute;
  height: 4px;
  top: 40px;
  border-radius: 2px;
}

.pb-line {
  background: rgba(255, 255, 255, 0.2);
}

.current-line {
  background: linear-gradient(90deg, #4fc3f7, #2ecc71);
  transition: width 0.2s ease-out;
  box-shadow: 0 0 10px rgba(79, 195, 247, 0.5);
}

.milestone {
  position: absolute;
  top: 20px;
  transform: translateX(-50%);
  text-align: center;
  transition: all 0.3s ease;
}

.milestone-icon {
  width: 32px;
  height: 32px;
  opacity: 0.5;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.milestone--reached .milestone-icon {
  opacity: 1;
  filter: grayscale(0%);
  transform: scale(1.2);
}

.current-position {
  position: absolute;
  top: 10px;
  transform: translateX(-50%);
  transition: left 0.2s ease-out;
}
```

---

### Random Time Effect for Unknown Values

**Flickering Time Display** (for upcoming splits):

```jsx
function RandomTime({ interval = 30 }) {
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const randomMin = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const randomSec = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      setTime(`${randomMin}:${randomSec}`);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return <span className="random-time">{time}</span>;
}

// Usage in timeline
function TimelineItem({ split, isPredicted }) {
  return (
    <div className="timeline-item">
      <span className="split-name">{split.name}</span>
      {isPredicted ? (
        <RandomTime />
      ) : (
        <span className="split-time">
          {convertMillisecondsToTime(split.time)}
        </span>
      )}
    </div>
  );
}
```

```css
.random-time {
  font-family: 'Minecraft', monospace;
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
  letter-spacing: 2px;
}
```

---

### Segment Statistics Display

**Break down match time by game phases**:

```javascript
// Timeline events for MCSR matches
const TIMELINE_EVENTS = [
  'overworld',
  'nether_enter',
  'bastion_enter',
  'fortress_enter',
  'nether_exit',
  'stronghold_enter',
  'end_enter',
  'finish'
];

/**
 * Calculate time spent in each segment
 */
function aggregateSegmentStats(timeline) {
  const stats = {
    overworld: 0,
    nether: 0,
    bastion: 0,
    fortress: 0,
    stronghold: 0,
    end: 0
  };

  for (let i = 1; i < timeline.length; i++) {
    const prev = timeline[i - 1];
    const curr = timeline[i];
    const duration = curr.time - prev.time;

    // Categorize based on current location
    if (curr.event.includes('nether') || curr.event.includes('bastion') || curr.event.includes('fortress')) {
      if (curr.event.includes('bastion')) stats.bastion += duration;
      else if (curr.event.includes('fortress')) stats.fortress += duration;
      else stats.nether += duration;
    } else if (curr.event.includes('stronghold')) {
      stats.stronghold += duration;
    } else if (curr.event.includes('end')) {
      stats.end += duration;
    } else {
      stats.overworld += duration;
    }
  }

  return stats;
}

function SegmentStatsDisplay({ timeline }) {
  const stats = aggregateSegmentStats(timeline);

  return (
    <div className="segment-stats">
      {Object.entries(stats).map(([segment, duration]) => (
        <div key={segment} className="stat-card">
          <div className="stat-icon">{getSegmentIcon(segment)}</div>
          <div className="stat-label">{segment}</div>
          <div className="stat-value">
            {convertMillisecondsToTime(duration, false)}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Minecraft-Themed Visual Styling

**Pixelated Aesthetic**:

```css
/* Apply Minecraft font and pixelated rendering */
@font-face {
  font-family: 'Minecraft';
  src: url('fonts/Minecraft.ttf') format('truetype');
}

.mcsr-widget {
  font-family: 'Minecraft', monospace;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* Minecraft block textures as backgrounds */
.segment--overworld {
  background-image: url('textures/grass_block.png');
  background-size: 60px;
  background-repeat: repeat-x;
}

.segment--nether {
  background-image: url('textures/netherrack.png');
  background-size: 60px;
  background-repeat: repeat-x;
}

.segment--end {
  background-image: url('textures/end_stone.png');
  background-size: 60px;
  background-repeat: repeat-x;
}
```

**Minecraft-Inspired Color Palette**:

```javascript
const MINECRAFT_THEME = {
  grass: '#7cbd56',
  dirt: '#8b6d47',
  stone: '#7d7d7d',
  diamond: '#4fc3f7',
  emerald: '#2ecc71',
  gold: '#f4d03f',
  redstone: '#e74c3c',
  netherrack: '#8b3a3a',
  endStone: '#e3e8a0',
  obsidian: '#1a1a2e'
};
```

---

### Real-Time Updates and Polling

**Efficient data fetching for live pace tracking**:

```javascript
import useSWR from 'swr';

function useLiveMatch(matchId, refreshInterval = 1000) {
  const { data, error, isLoading } = useSWR(
    matchId ? `/api/matches/${matchId}/live` : null,
    fetcher,
    {
      refreshInterval,
      dedupingInterval: refreshInterval,
      revalidateOnFocus: false
    }
  );

  return {
    match: data,
    isLoading,
    hasError: error
  };
}

// Usage in component
function LivePaceTracker({ matchId }) {
  const { match, isLoading } = useLiveMatch(matchId, 500); // Update every 500ms

  if (isLoading) return <LoadingSkeleton />;

  return (
    <PaceComparison
      currentMatch={match}
      personalBest={match.pbData}
    />
  );
}
```

---

### Interactive Features

**Hoverable Split Details**:

```jsx
function InteractiveSplit({ split, pbSplit }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className="split-item"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className="split-main">
        <span>{split.name}</span>
        <span>{convertMillisecondsToTime(split.time)}</span>
      </div>

      {showDetails && (
        <div className="split-tooltip">
          <div>Personal Best: {convertMillisecondsToTime(pbSplit.time)}</div>
          <div>Difference: {formatTimeDifference(split.time - pbSplit.time)}</div>
          <div>Pace: {((split.time / pbSplit.time) * 100).toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}
```

---

### Complete Pace Widget Example

```jsx
function MCSRPaceWidget({ username }) {
  const { data: user } = useSWR(`/users/${username}`);
  const { data: matches } = useSWR(`/users/${username}/matches?count=1&filter=2`);

  const currentMatch = matches?.[0];
  const bestTime = user?.statistics?.total?.ranked?.bestTime;

  if (!currentMatch || !bestTime) return <div>No data available</div>;

  return (
    <div className="mcsr-pace-widget">
      {/* Header */}
      <div className="widget-header">
        <img
          src={`https://crafatar.com/avatars/${user.uuid}?size=48&overlay`}
          alt={user.nickname}
          className="player-avatar"
        />
        <div className="player-info">
          <h2>{user.nickname}</h2>
          <span className="elo">{user.eloRate} ELO</span>
        </div>
      </div>

      {/* Pace Indicator */}
      <PaceIndicator
        currentPace={currentMatch.result.time}
        pbPace={bestTime}
      />

      {/* Progress Timeline */}
      <ProgressTimeline
        currentTime={currentMatch.result.time}
        pbTime={bestTime}
        milestones={currentMatch.timelines}
      />

      {/* Segment Stats */}
      <SegmentStatsDisplay timeline={currentMatch.timelines} />

      {/* Detailed Splits */}
      <div className="splits-container">
        <h3>PB Timeline vs Current</h3>
        <PaceComparison
          currentMatch={currentMatch}
          personalBest={/* fetch PB data */}
        />
      </div>
    </div>
  );
}
```

---

### Theme Variations

The MCSRPaceWidget project includes multiple visual themes:

1. **Default** - Clean, minimal design with white/red color scheme
2. **Standard** - Traditional split timer appearance
3. **Texture Bar** - Minecraft block textures as progress bars
4. **Paceman** - Compact horizontal layout
5. **Niwatori** - Japanese-style vertical layout
6. **Horizontal** - Wide-screen optimized layout

**Implementing theme switching**:

```javascript
const themes = {
  default: () => import('./themes/default.css'),
  standard: () => import('./themes/standard.css'),
  textureBar: () => import('./themes/texture-bar.css'),
};

function ThemeProvider({ theme, children }) {
  useEffect(() => {
    if (themes[theme]) {
      themes[theme]();
    }
  }, [theme]);

  return <div className={`theme-${theme}`}>{children}</div>;
}
```

---

## Support and Contact

For API support, feature requests, or to request an API key for expanded rate limits:

- Join the MCSR Ranked Discord server
- Visit the official website: [https://mcsrranked.com/](https://mcsrranked.com/)
- Check the wiki: [https://wiki.mcsrranked.com/](https://wiki.mcsrranked.com/)

---

**Last Updated**: 2025-10-31
**API Version**: v1 (inferred from current usage)
**Documentation Status**: Community-compiled from official sources and reverse engineering
