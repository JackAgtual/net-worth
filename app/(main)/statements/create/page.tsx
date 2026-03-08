import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkSession } from "@/lib/auth/auth-utils";
import { getStatementFormPrefillData } from "@/lib/utils/form-utils-server";
import { SearchParams } from "next/dist/server/request/search-params";
import { z } from "zod";
import ChooseMode from "./components/choose-mode";
import StatementForm from "./components/statement-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await checkSession();

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
  const defaultVals = await getStatementFormPrefillData(yearInt);
  return (
    <Card>
      <CardHeader>Add a statement</CardHeader>
      <CardContent>
        <StatementForm defaultValues={defaultVals} />
      </CardContent>
    </Card>
  );
}
