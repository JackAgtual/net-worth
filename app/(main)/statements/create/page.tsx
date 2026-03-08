import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSession } from "@/lib/auth/auth-utils";
import { redirect } from "next/navigation";
import StatementForm from "./components/statement-form";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
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
