import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PlayerData } from '@/types';

export function parsePlayerData(records: any[]): PlayerData[] {
  // Validate input
  if (!records || !Array.isArray(records) || records.length === 0) {
    console.warn('No records provided to parsePlayerData');
    return [];
  }

  // Group records by a unique identifier (combination of name and year)
  const playerStatsMap = new Map<string, PlayerData>();

  // Track total games across all players
  let totalGames = 0;

  records.forEach((record: any, index: number) => {
    // Skip invalid records
    if (!record || typeof record !== 'object') {
      console.warn('Skipping invalid record', record);
      return;
    }

    const name = record.name || "Unknown";
    const year = record.year || "Unknown";
    
    // Create a unique key for each player-year combination
    const uniqueKey = `${name}-${year}-${index}`;
    
    // Safely parse numeric values
    const safeParseFloat = (value: string | undefined) => {
      if (value === undefined) return 0;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const safeParseInt = (value: string | undefined) => {
      if (value === undefined) return 0;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : parsed;
    };

    const games = safeParseInt(record.total_games);
    totalGames += games;

    // If player doesn't exist in map, create a new entry
    if (!playerStatsMap.has(uniqueKey)) {
      playerStatsMap.set(uniqueKey, {
        // Add a unique identifier
        id: uniqueKey,
        player_id: safeParseInt(record.player_id),
        name,
        year: String(safeParseInt(record.year)),
        stats_url: record.stats_url,
        statsUrl: record.stats_url,
        
        // Winrate columns
        overall_winrate: safeParseFloat(record.overall_winrate),
        citizen_winrate: safeParseFloat(record.citizen_winrate),
        sheriff_winrate: safeParseFloat(record.sheriff_winrate),
        mafia_winrate: safeParseFloat(record.mafia_winrate),
        don_winrate: safeParseFloat(record.don_winrate),

        // Game count columns
        total_games: games,
        citizen_games: safeParseInt(record.citizen_games),
        sheriff_games: safeParseInt(record.sheriff_games),
        mafia_games: safeParseInt(record.mafia_games),
        don_games: safeParseInt(record.don_games),

        // Extra points columns
        extra_points_avg_10_games: safeParseFloat(record.extra_points_avg_10_games),
        extra_points_mafia_avg: safeParseFloat(record.extra_points_mafia_avg),
        extra_points_don_avg: safeParseFloat(record.extra_points_don_avg),
        extra_points_citizen_avg: safeParseFloat(record.extra_points_citizen_avg),
        extra_points_sheriff_avg: safeParseFloat(record.extra_points_sheriff_avg),

        // Player category and ranking
        player_category: record.player_category || "Unknown",
        overall_rank: safeParseFloat(record.overall_rank),
        overall_score: safeParseFloat(record.overall_score),
        citizen_rank: safeParseFloat(record.citizen_rank),
        sheriff_rank: safeParseFloat(record.sheriff_rank),
        mafia_rank: safeParseFloat(record.mafia_rank),
        don_rank: safeParseFloat(record.don_rank),

        // Region
        region: record.region || "N/A",

        // Derived/calculated columns
        games,
        wins: games - safeParseInt(record.losses),
        losses: safeParseInt(record.losses),
        winRate: safeParseFloat(record.overall_winrate),
        citizenWinRate: safeParseFloat(record.citizen_winrate),
        mafiaWinRate: safeParseFloat(record.mafia_winrate),
        blackWins: safeParseInt(record.don_games),
        redWins: safeParseInt(record.sheriff_games),
        civilianWins: safeParseInt(record.citizen_games),
        playerRank: safeParseFloat(record.overall_rank),
        playerScore: safeParseFloat(record.overall_score),
        totalGames: totalGames,
      });
    } else {
      // If player exists, update or aggregate stats
      const existingPlayer = playerStatsMap.get(uniqueKey)!;
      existingPlayer.games += games;
      existingPlayer.wins += games - safeParseInt(record.losses);
      existingPlayer.losses += safeParseInt(record.losses);
    }
  });

  // Convert map to array
  const processedRecords = Array.from(playerStatsMap.values());

  return processedRecords;
}

export async function getPlayerData() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'gomafia_player_rankings.csv');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const records = parse(fileContents, {
    columns: true,
    skip_empty_lines: true,
  });

  return parsePlayerData(records);
}
