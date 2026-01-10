import { Asset } from "@/lib/mongodb/schema";
import dbConnect from "@/lib/mongodb/mongodb";

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
              <li>
                {asset.title}: ${asset.amount}
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
