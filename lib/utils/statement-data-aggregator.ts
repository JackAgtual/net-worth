import {
  AssetGrowthChartData,
  NetWorthChartData,
} from "../types/chart-data-types";
import { StatementHydrated } from "../types/statement-types";

export class StatementDataAggregator {
  mostRecentStatement: StatementHydrated;
  statements: StatementHydrated[];

  constructor(statements: StatementHydrated[]) {
    if (statements.length === 0) {
      throw new Error(
        "StatementDataAggregator requires a non-empty statement array"
      );
    }
    this.statements = statements;
    this.mostRecentStatement = statements[-1];
  }

  async #getAllDataFromStatement(statement: StatementHydrated) {
    const [netWorth, assets, liabilities, lastYearAssetGrowth] =
      await Promise.all([
        // net worth
        statement.getNetWorth(),
        statement.getTotalAssetAmount(),
        statement.getTotalLiabilityAmount(),

        // asset growth
        statement.getLastYearAssetGrowth(),
      ]);

    return {
      year: statement.year,
      netWorth,
      assets,
      liabilities,
      lastYearAssetGrowth,
      lastyearSalary: statement.lastYearSalary,
    };
  }

  async getMostRecentStatementData() {
    return this.#getAllDataFromStatement(this.mostRecentStatement);
  }

  async getPlotData() {
    const allData = await Promise.all(
      this.statements.map(async (statement) => {
        return this.#getAllDataFromStatement(statement);
      })
    );

    const netWorth: NetWorthChartData[] = [];
    const assetGrowth: AssetGrowthChartData[] = [];

    for (const data of allData) {
      const { year } = data;
      netWorth.push({
        year,
        netWorth: data.netWorth,
        totalAssetAmount: data.assets,
        totalLiabilityAmount: data.liabilities,
      });

      assetGrowth.push({
        year,
        lastYearSalary: data.lastyearSalary,
        lastYearAssetGrowth: data.lastYearAssetGrowth,
      });
    }

    return { netWorth, assetGrowth };
  }
}
