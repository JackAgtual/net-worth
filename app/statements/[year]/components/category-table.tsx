import { Category } from "@/types/types";
import { StatementHydrated } from "@/lib/db/models/statement";

export default async function CategoryTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const contents = await Promise.all(
    Object.keys(Category).map(async (category) => {
      const categoryEnum = Category[category as keyof typeof Category];
      const amount = await statement.getTotalAssetAmountByCategory(
        categoryEnum
      );
      const percent = await statement.getPercentOfAssetsByCategory(
        categoryEnum
      );
      return {
        category,
        amount,
        percent,
      };
    })
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Amount</th>
          <th>Percent of assets</th>
        </tr>
      </thead>
      <tbody>
        {contents.map((row, index) => {
          return (
            <tr key={index}>
              <td>{row.category}</td>
              <td>{row.amount}</td>
              <td>{row.percent}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
