export interface PlayerData {
  id: string;  // Unique identifier
  player_id: number;
  name: string;
  stats_url?: string;
  statsUrl?: string;
  year: string;
  region: string;  // Player's region
  
  // Winrate columns
  overall_winrate: number;
  citizen_winrate: number;
  sheriff_winrate: number;
  mafia_winrate: number;
  don_winrate: number;

  // Game count columns
  total_games: number;
  citizen_games: number;
  sheriff_games: number;
  mafia_games: number;
  don_games: number;

  // Extra points columns
  extra_points_avg_10_games?: number;
  extra_points_mafia_avg?: number;
  extra_points_don_avg?: number;
  extra_points_citizen_avg?: number;
  extra_points_sheriff_avg?: number;

  // Player category and ranking
  player_category?: string;
  overall_rank?: number;
  overall_score?: number;
  
  // Rank columns
  citizen_rank?: number;
  sheriff_rank?: number;
  mafia_rank?: number;
  don_rank?: number;

  // Derived/calculated columns
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  citizenWinRate: number;
  mafiaWinRate: number;
  blackWins: number;
  redWins: number;
  civilianWins: number;
  playerRank?: number;
  playerScore?: number;
  totalGames?: number;
}
