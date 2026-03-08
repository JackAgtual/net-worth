import { checkSession } from "@/lib/auth/auth-utils";
import { getStatementFormPrefillData } from "@/lib/utils/form-utils-server";
import { SearchParams } from "next/dist/server/request/search-params";
import { z } from "zod";
import ChooseMode from "./components/choose-mode";
import StatementForm from "./components/statement-form";
import StatementFormCard from "./components/statement-form-card";

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
      <StatementFormCard>
        <StatementForm />
      </StatementFormCard>
    );

  const yearInt = z.coerce.number().int().parse(year);
  const defaultVals = await getStatementFormPrefillData(yearInt);
  return (
    <StatementFormCard>
      <StatementForm defaultValues={defaultVals} />
    </StatementFormCard>
  );
}
