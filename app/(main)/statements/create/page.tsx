import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkSession } from "@/lib/auth/auth-utils";
import { Statement } from "@/lib/db/models";
import { StatementForm as TStatementForm } from "@/lib/types/statement-types";
import { SearchParams } from "next/dist/server/request/search-params";
import { z } from "zod";
import ChooseMode from "./components/choose-mode";
import StatementForm from "./components/statement-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await checkSession();

  const { mode, year } = await searchParams;

  if (!mode) {
    return <ChooseMode />;
  }

  if (mode === "blank")
    return (
      <Card>
        <CardHeader>Add a statement</CardHeader>
        <CardContent>
          <StatementForm />
        </CardContent>
      </Card>
    );

  const yearInt = z.coerce.number().int().parse(year);
  const prefillStatement = await Statement.findOne({
    userId: session.user.id,
    year: yearInt,
  });

  if (!prefillStatement)
    throw new Error(`Could not populate statement data from ${yearInt}`);

  const [prefillAssets, prefillLiabilities] = await Promise.all([
    prefillStatement.getAssets(),
    prefillStatement.getLiabilities(),
  ]);

  const defaultVals = {
    assets: prefillAssets.map((asset) => {
      return {
        title: asset.title,
        category: asset.category,
        retirement: asset.retirement,
        includeInGrowthCalculation: asset.includeInGrowthCalculation,
        amountOneYearAgo: asset.amount,
      };
    }),
    liabilities: prefillLiabilities.map((liability) => {
      return {
        title: liability.title,
      };
    }),
  } as TStatementForm; // TODO: Fix typing
  return <StatementForm defaultValues={defaultVals} />;
}
