/**
 * API Validation Test Script
 * Tests the MCSR Ranked API integration to ensure all endpoints work correctly
 */

import {
  getUser,
  getUserAchievements,
  getLeaderboard,
  getLiveMatches,
  getMatch,
  getUserMatches,
  getPhaseLeaderboard,
  getPlayoffs,
  getRecordLeaderboard,
  getWeeklyRace,
} from '../src/lib/api/endpoints';

const TEST_PLAYER = 'Feinberg'; // Well-known MCSR Ranked player
const TEST_RESULTS: { test: string; status: 'PASS' | 'FAIL'; message?: string }[] = [];

async function runTest(
  name: string,
  testFn: () => Promise<void>
): Promise<void> {
  try {
    await testFn();
    TEST_RESULTS.push({ test: name, status: 'PASS' });
    console.log(`✓ ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    TEST_RESULTS.push({ test: name, status: 'FAIL', message });
    console.error(`✗ ${name}: ${message}`);
  }
}

async function validateAPIs() {
  console.log('🚀 Starting MCSR Ranked API Validation...\n');
  console.log('=====================================');
  console.log('Testing API Endpoints');
  console.log('=====================================\n');

  // Test 1: Get User Profile
  await runTest('GET /users/:username - Get user profile', async () => {
    const user = await getUser(TEST_PLAYER);

    if (!user.uuid) throw new Error('User UUID is missing');
    if (!user.nickname) throw new Error('User nickname is missing');
    if (user.eloRate === undefined) throw new Error('User eloRate is missing');
    if (user.eloRank === undefined) throw new Error('User eloRank is missing');
    if (!user.statistics) throw new Error('User statistics are missing');

    console.log(`  → Found user: ${user.nickname} (ELO: ${user.eloRate}, Rank: #${user.eloRank})`);
  });

  // Test 1b: Get embedded user achievements
  await runTest('GET /users/:username - Get embedded achievements', async () => {
    const achievements = await getUserAchievements(TEST_PLAYER);

    if (!Array.isArray(achievements)) throw new Error('Achievements should be an array');

    console.log(`  → Found ${achievements.length} achievements`);
  });

  // Test 2: Get User Matches
  await runTest('GET /users/:username/matches - Get user match history', async () => {
    const matches = await getUserMatches(TEST_PLAYER, { count: 5 });

    if (!Array.isArray(matches)) throw new Error('Matches should be an array');
    if (matches.length === 0) throw new Error('No matches returned');

    const match = matches[0];
    if (!match.id) throw new Error('Match ID is missing');
    if (!match.players) throw new Error('Match players are missing');
    if (!match.result) throw new Error('Match result is missing');

    console.log(`  → Found ${matches.length} matches, latest: ${match.id}`);
  });

  // Test 3: Get Match Details
  await runTest('GET /matches/:id - Get detailed match info', async () => {
    // First get a match ID from user matches
    const matches = await getUserMatches(TEST_PLAYER, { count: 1 });
    if (matches.length === 0) throw new Error('No matches to test with');

    const matchId = String(matches[0].id);
    const match = await getMatch(matchId);

    if (!match.id) throw new Error('Match ID is missing');
    if (!match.result) throw new Error('Match result is missing');

    console.log(`  → Match ${matchId}: ${match.category} (Winner time: ${match.result.time}ms)`);
  });

  // Test 4: Get Leaderboard
  await runTest('GET /leaderboard - Get global leaderboard', async () => {
    const leaderboard = await getLeaderboard({ count: 10 });

    if (!Array.isArray(leaderboard)) throw new Error('Leaderboard should be an array');
    if (leaderboard.length === 0) throw new Error('Leaderboard is empty');

    const topPlayer = leaderboard[0];
    if (!topPlayer.uuid) throw new Error('Player UUID is missing');
    if (!topPlayer.nickname) throw new Error('Player nickname is missing');
    if (topPlayer.eloRate === null) throw new Error('Player eloRate is missing');

    console.log(`  → Top player: ${topPlayer.nickname} (ELO: ${topPlayer.eloRate})`);
  });

  // Test 5: Get Live Matches
  await runTest('GET /live - Get live matches', async () => {
    const liveMatches = await getLiveMatches();

    if (!Array.isArray(liveMatches)) throw new Error('Live matches should be an array');

    console.log(`  → Found ${liveMatches.length} live matches`);
  });

  // Test 6: Get Weekly Race
  await runTest('GET /weekly-race - Get weekly race', async () => {
    const weeklyRace = await getWeeklyRace();

    if (typeof weeklyRace.id !== 'number') throw new Error('Weekly race ID is missing');
    if (!weeklyRace.seed) throw new Error('Weekly race seed is missing');
    if (!Array.isArray(weeklyRace.leaderboard)) throw new Error('Weekly race leaderboard should be an array');

    console.log(`  → Weekly race #${weeklyRace.id}: ${weeklyRace.leaderboard.length} entries`);
  });

  // Test 7: Get Record Leaderboard
  await runTest('GET /record-leaderboard - Get fastest completions', async () => {
    const records = await getRecordLeaderboard();

    if (!Array.isArray(records)) throw new Error('Record leaderboard should be an array');
    if (records.length === 0) throw new Error('Record leaderboard is empty');
    if (!records[0].user?.nickname) throw new Error('Record player nickname is missing');

    console.log(`  → Found ${records.length} records, top: ${records[0].user.nickname}`);
  });

  // Test 8: Get Phase Leaderboard
  await runTest('GET /phase-leaderboard - Get phase standings', async () => {
    const phaseLeaderboard = await getPhaseLeaderboard();

    if (!phaseLeaderboard.phase) throw new Error('Phase metadata is missing');
    if (!Array.isArray(phaseLeaderboard.users)) throw new Error('Phase users should be an array');

    console.log(`  → Phase ${phaseLeaderboard.phase.number}, season ${phaseLeaderboard.phase.season}: ${phaseLeaderboard.users.length} users`);
  });

  // Test 9: Get Playoffs
  await runTest('GET /playoffs - Get playoffs bracket', async () => {
    const playoffs = await getPlayoffs();

    if (!playoffs.data) throw new Error('Playoffs data is missing');
    if (!Array.isArray(playoffs.data.players)) throw new Error('Playoff players should be an array');
    if (!Array.isArray(playoffs.data.matches)) throw new Error('Playoff matches should be an array');

    console.log(`  → Playoffs season ${playoffs.data.season}: ${playoffs.data.players.length} players`);
  });

  // Summary
  console.log('\n=====================================');
  console.log('Test Summary');
  console.log('=====================================\n');

  const passed = TEST_RESULTS.filter(r => r.status === 'PASS').length;
  const failed = TEST_RESULTS.filter(r => r.status === 'FAIL').length;

  console.log(`Total Tests: ${TEST_RESULTS.length}`);
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed Tests:');
    TEST_RESULTS.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ✗ ${r.test}`);
      if (r.message) console.log(`    → ${r.message}`);
    });
  }

  console.log('\n=====================================');

  return failed === 0;
}

// Run validation
validateAPIs()
  .then((success) => {
    if (success) {
      console.log('\n✅ All API validations passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some API validations failed!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Validation script failed:', error);
    process.exit(1);
  });
