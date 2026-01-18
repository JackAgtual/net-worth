import { Asset, Liability } from "@/lib/db/models";

import dbConnect from "@/lib/db/mongodb";

export default async function Home() {
  await dbConnect();

  const assets = await Asset.find();
  const liabilities = await Liability.find();

  return (
    <div>
      <main>
        <h1 className="flex justify-center">Net worth tracker</h1>
        {/* <h2>Assets</h2>
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
        <h2>Liabilities</h2>
        <ol>
          {liabilities.map((liability) => {
            return (
              <li>
                {liability.title}: ${liability.amount}
              </li>
            );
          })}
        </ol> */}
      </main>
    </div>
  );
}
