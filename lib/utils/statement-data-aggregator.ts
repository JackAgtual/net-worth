import {
  AssetGrowthChartData,
  ContributionAmountChartData,
  ContributionPercentChartData,
  NetWorthChartData,
} from "../types/chart-data-types";
import { StatementHydrated } from "../types/statement-types";
import { Contributor } from "../types/types";

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
    const [
      netWorth,
      assets,
      liabilities,
      lastYearAssetGrowth,
      totalContributions,
      selfContributions,
      nonSelfContributions,
      totalContributionsPctOfSalary,
      selfContributionsPctOfSalary,
      nonSelfContributionsPctOfSalary,
    ] = await Promise.all([
      // net worth
      statement.getNetWorth(),
      statement.getTotalAssetAmount(),
      statement.getTotalLiabilityAmount(),

      // asset growth
      statement.getLastYearAssetGrowth(),

      // contributions
      statement.getContributionAmountByContributor(Contributor.All),
      statement.getContributionAmountByContributor(Contributor.Self),
      statement.getContributionAmountByContributor(Contributor.NonSelf),
      statement.getContributioPercentOfSalaryByContributor(Contributor.All),
      statement.getContributioPercentOfSalaryByContributor(Contributor.Self),
      statement.getContributioPercentOfSalaryByContributor(Contributor.NonSelf),
    ]);

    return {
      year: statement.year,
      netWorth,
      assets,
      liabilities,
      lastYearAssetGrowth,
      lastyearSalary: statement.lastYearSalary,
      contributions: {
        amount: {
          total: totalContributions,
          self: selfContributions,
          nonSelf: nonSelfContributions,
        },
        percentOfSalary: {
          total: totalContributionsPctOfSalary,
          self: selfContributionsPctOfSalary,
          nonSelf: nonSelfContributionsPctOfSalary,
        },
      },
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
    const contributionAmount: ContributionAmountChartData[] = [];
    const cumulativeContributionAmount: ContributionAmountChartData[] = [];
    const contributionPercentOfSalary: ContributionPercentChartData[] = [];

    const curCumilativeContributions = { total: 0, self: 0, nonSelf: 0 };

    for (const data of allData) {
      const { year, contributions } = data;
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

      const { amount, percentOfSalary } = contributions;
      contributionAmount.push({
        year,
        totalContributionAmount: amount.total,
        selfContributionAmount: amount.self,
        nonSelfContributionAmount: amount.nonSelf,
      });

      contributionPercentOfSalary.push({
        year,
        totalContributionPct: percentOfSalary.total,
        selfContributionPct: percentOfSalary.self,
        nonSelfContributionPct: percentOfSalary.nonSelf,
      });

      curCumilativeContributions.total += amount.total;
      curCumilativeContributions.self += amount.self;
      curCumilativeContributions.nonSelf += amount.nonSelf;

      cumulativeContributionAmount.push({
        year,
        totalContributionAmount: curCumilativeContributions.total,
        selfContributionAmount: curCumilativeContributions.self,
        nonSelfContributionAmount: curCumilativeContributions.nonSelf,
      });
    }

    return {
      netWorth,
      assetGrowth,
      contributionAmount,
      contributionPercentOfSalary,
      cumulativeContributionAmount,
    };
  }
}
