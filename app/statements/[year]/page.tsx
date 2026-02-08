import { getSession } from "@/lib/auth/auth-utils";
import { Statement } from "@/lib/db/models";
import dbConnect from "@/lib/db/mongodb";
import { redirect } from "next/navigation";
import AssetTable from "./components/asset-table";
import CategoryTable from "./components/category-table";
import ContributionTable from "./components/contribution-table";
import IncomeTable from "./components/income-table";
import LiabilityTable from "./components/liability-table";
import NetWorthTable from "./components/net-worth-table";
import AddAsset from "./components/add-asset";

export default async function Page({
  params,
}: {
  params: Promise<{ year: number }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const { year } = await params;

  const statement = await Statement.findOne({ year, userId: session.user.id });

  if (!statement) return <div>Couldn't find that statement</div>;

  const [assets, liabilities] = await Promise.all([
    statement.getAssets(),
    statement.getLiabilities(),
  ]);

  const statementId = statement._id.toString();

  return (
    <>
      <h1>{year} statement</h1>
      <h2>Assets</h2>
      <AssetTable assets={assets} statementId={statementId} />
      {/* <AddAsset /> */}
      <h2>Liabilities</h2>
      <LiabilityTable liabilities={liabilities} statementId={statementId} />
      <h2>Net worth</h2>
      <NetWorthTable statement={statement} />
      <h2>Category analysis</h2>
      <CategoryTable statement={statement} />
      <h2>Income analysis</h2>
      <IncomeTable statement={statement} />
      <h2>Contribution analysis</h2>
      <ContributionTable statement={statement} />
    </>
  );
}
