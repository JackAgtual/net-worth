import { StatementHydrated } from "@/lib/db/models/statement";

export default async function IncomeTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const contents = [
    {
      name: "Last year income",
      value: statement.lastYearSalary,
    },
    {
      name: "Last year asset growth",
      value: await statement.getLastYearAssetGrowth(),
    },
    {
      name: "Last year asset growth percent of salary",
      value: await statement.getLastYearAssetGrowthPercentOfSalary(),
    },
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {contents.map((row, index) => {
          return (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
