/*
  Auto-populate public/achievements/sources.json with image URLs scraped
  from the Minecraft Wiki achievements/advancements page provided by the user.

  Behavior:
  - Fetches the wiki page (default: Getting started section URL or a full page).
  - Extracts PNG/SVG image URLs.
  - Fills any missing ids in sources.json with found URLs (does not overwrite existing).
  - Order is arbitrary but stable by appearance order.

  Usage:
    node scripts/populate-achievements-from-wiki.js [url]
*/

const fs = require('fs/promises');
const path = require('path');

const TARGET_IDS = [
  'BestTime',
  'HighestWinStreak',
  'PlayedMatches',
  'Playtime',
  'Wins',
  'SeasonOutcome',
  'PlayoffsOutcome',
  'SummonWither',
  'IronPickless',
  'Oneshot',
  'Overtake',
  'Foodless',
  'ClassicRun',
  'Netherite',
  'Armorless',
  'HighLevel',
  'EgapHolder',
  'IronHoe',
  'WeeklyRace',
  'Secret',
];

const SOURCES_PATH = path.resolve(process.cwd(), 'public', 'achievements', 'sources.json');
const DEFAULT_URL = 'https://minecraft.wiki/w/Achievement#Getting_started';

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed ${res.status} for ${url}`);
  return await res.text();
}

function extractImageUrls(html) {
  const urls = new Set();
  const regex = /(https?:\/\/[^\"'\s>]+\.(?:png|svg))(?:\?[^\"'\s>]*)?/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const u = m[1];
    // Prefer wiki-hosted icons and filter large spritesheets
    if (/minecraft\.wiki|wikimedia|static\.minecraft|fandom|gamepedia/i.test(u)) {
      urls.add(u);
    }
  }
  return Array.from(urls);
}

async function main() {
  const url = process.argv[2] || DEFAULT_URL;
  const html = await fetchText(url);
  let images = extractImageUrls(html);
  // Prefer advancement/achievement icons specifically
  images = images.filter((u) => /(advancement|achievement)/i.test(u));
  if (images.length === 0) {
    console.log('No images found in page:', url);
    return;
  }

  const reset = process.argv.includes('--reset');
  const raw = await fs.readFile(SOURCES_PATH, 'utf-8').catch(() => (reset ? '{}' : '{}'));
  const sources = reset ? {} : JSON.parse(raw);

  let idx = 0;
  let added = 0;
  for (const id of TARGET_IDS) {
    if (sources[id]) continue; // don't overwrite
    // Pick next image url; prefer ones that include keywords
    let chosen = null;
    for (; idx < images.length && !chosen; idx++) {
      const u = images[idx];
      if (/(advancement|achievement|icon|badge|trophy|nether|end|wither|iron|gold|emerald|diamond)/i.test(u)) {
        chosen = u;
      }
    }
    if (!chosen && idx < images.length) {
      chosen = images[idx++];
    }
    if (chosen) {
      sources[id] = chosen;
      added++;
    }
  }

  await fs.writeFile(SOURCES_PATH, JSON.stringify(sources, null, 2));
  console.log(`Populated ${added} ids. Edit sources.json to fine-tune, then run: npm run fetch:achievements`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
