import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import { getPlayerData } from "@/lib/csv-parser";

export default async function Home() {
  const data = await getPlayerData();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-8">GoMafia Player Analytics</h1>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Player Statistics</h2>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}
