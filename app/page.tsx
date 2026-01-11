import { Asset } from "@/lib/db/asset";
import dbConnect from "@/lib/db/mongodb";

export default async function Home() {
  await dbConnect();

  const assets = await Asset.find();

  return (
    <div>
      <main>
        <h1 className="flex justify-center">Net worth tracker</h1>
        <ol>
          {assets.map((asset) => {
            return (
              <li key={asset._id.toString()}>
                {asset.title}: ${asset.amount} category: {asset.category}
                growth: {asset.growthFromAppreciation}
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
