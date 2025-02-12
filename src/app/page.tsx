import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import { parseCSV } from "@/lib/csv-parser";
import path from "path";

export default async function Home() {
  const data = await parseCSV(
    path.join(process.cwd(), "public/data/gomafia_player_stats.csv")
  );

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">GoMafia Player Statistics</h1>
      <DataTable columns={columns} data={data} />
    </main>
  );
}
