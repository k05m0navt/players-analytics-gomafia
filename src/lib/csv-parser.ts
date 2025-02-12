import { parse } from "csv-parse/sync";
import { PlayerData } from "@/types";
import fs from "fs";

export async function parseCSV(filePath: string): Promise<PlayerData[]> {
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map((record: any) => ({
    name: record.name,
    games: parseInt(record.games),
    wins: parseInt(record.wins),
    losses: parseInt(record.losses),
    winRate: parseFloat(record.winRate),
    blackWins: parseInt(record.blackWins),
    redWins: parseInt(record.redWins),
    sheriffWins: parseInt(record.sheriffWins),
    donWins: parseInt(record.donWins),
    mafiaWins: parseInt(record.mafiaWins),
    civilianWins: parseInt(record.civilianWins),
  }));
}
