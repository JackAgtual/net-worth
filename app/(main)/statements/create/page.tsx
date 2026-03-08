import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSession } from "@/lib/auth/auth-utils";
import { redirect } from "next/navigation";
import StatementForm from "./components/statement-form";
import ChooseMode from "./components/choose-mode";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { mode, prefill } = await searchParams;
  // console.log({ mode, prefill });

  if (!mode) {
    return <ChooseMode />;
  }

  return (
    <Card>
      <CardHeader>Add a statement</CardHeader>
      <CardContent>
        <StatementForm />
      </CardContent>
    </Card>
  );
}
