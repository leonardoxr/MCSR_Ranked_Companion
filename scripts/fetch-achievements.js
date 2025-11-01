/*
  Fetch achievement icon images from remote URLs you control and save them
  into public/achievements using the app's expected filenames.

  Usage:
    1) Edit public/achievements/sources.json with id -> remote URL.
    2) Run: npm run fetch:achievements
*/

const fs = require('fs/promises');
const path = require('path');

// Mirrors src/lib/utils/achievements.ts mapping filenames
const TARGET_FILES = {
  BestTime: 'best-time.svg',
  HighestWinStreak: 'win-streak.svg',
  PlayedMatches: 'matches-played.svg',
  Playtime: 'playtime.svg',
  Wins: 'wins.svg',
  SeasonOutcome: 'season-result.svg',
  PlayoffsOutcome: 'playoffs-result.svg',
  SummonWither: 'summon-wither.svg',
  IronPickless: 'iron-pickless.svg',
  Oneshot: 'oneshot.svg',
  Overtake: 'overtake.svg',
  Foodless: 'foodless.svg',
  ClassicRun: 'classic-run.svg',
  Netherite: 'netherite.svg',
  Armorless: 'armorless.svg',
  HighLevel: 'high-level.svg',
  EgapHolder: 'egap-holder.svg',
  IronHoe: 'iron-hoe.svg',
  WeeklyRace: 'weekly-race.svg',
  Secret: 'secret.svg',
};

const SOURCES_PATH = path.resolve(process.cwd(), 'public', 'achievements', 'sources.json');
const OUT_DIR = path.resolve(process.cwd(), 'public', 'achievements');

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function fetchBuffer(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await ensureDir(OUT_DIR);
  const raw = await fs.readFile(SOURCES_PATH, 'utf-8').catch(() => '{}');
  const sources = JSON.parse(raw);

  const entries = Object.entries(sources);
  if (entries.length === 0) {
    console.log('No sources in public/achievements/sources.json');
    console.log('Add { "BestTime": "https://example/icon.png", ... } and re-run.');
    return;
  }

  let ok = 0, fail = 0;
  for (const [id, url] of entries) {
    const file = TARGET_FILES[id];
    if (!file) {
      console.warn(`Skipping unknown id ${id}`);
      continue;
    }
    try {
      const buf = await fetchBuffer(url);
      const out = path.join(OUT_DIR, file);
      await fs.writeFile(out, buf);
      console.log(`✔ Saved ${id} -> ${file}`);
      ok++;
    } catch (e) {
      console.error(`✖ Failed ${id}: ${e.message}`);
      fail++;
    }
  }
  console.log(`Done. Saved: ${ok}. Failed: ${fail}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
