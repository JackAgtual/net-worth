import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatementFormCard({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>Add a statement</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
