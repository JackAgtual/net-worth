import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function StatementFormCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>Add a statement</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
