"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatementOverview } from "@/lib/types/statement-types";
import { formatAsDollar } from "@/lib/utils/format-utils";
import { useRouter } from "next/navigation";

type StatementsTableProps = {
  data: StatementOverview[];
};

export default function StatementsTable({ data }: StatementsTableProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Year</TableHead>
          <TableHead>Net Worth</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ year, netWorth }) => (
          <TableRow
            key={year}
            className="cursor-pointer"
            onClick={() => router.push(`/statements/${year}`)}
          >
            <TableCell>{year}</TableCell>
            <TableCell>{formatAsDollar(netWorth)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
