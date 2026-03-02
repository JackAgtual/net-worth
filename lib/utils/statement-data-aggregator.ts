import {
  AssetGrowthChartData,
  ContributionAmountChartData,
  ContributionPercentChartData,
  ContributionValues,
  NetWorthChartData,
} from "../types/chart-data-types";
import { StatementHydrated } from "../types/statement-types";
import { Contributor } from "../types/types";
import { deepResolveObject } from "./object-utils";

export class StatementDataAggregator {
  mostRecentStatement: StatementHydrated;
  statements: StatementHydrated[];

  contributors = Object.values(Contributor);

  constructor(statements: StatementHydrated[]) {
    if (statements.length === 0) {
      throw new Error(
        "StatementDataAggregator requires a non-empty statement array"
      );
    }
    this.statements = statements;
    this.mostRecentStatement = statements[statements.length - 1];
  }

  async #getAllDataFromStatement(statement: StatementHydrated) {
    const mapContributions = <T>(fn: (c: Contributor) => T) => {
      return Object.fromEntries(
        this.contributors.map((contributor) => [contributor, fn(contributor)])
      ) as Record<Contributor, T>;
    };

    const contributions = {
      amount: mapContributions((c) =>
        statement.getContributionAmountByContributor(c)
      ),
      percentOfSalary: mapContributions((c) =>
        statement.getContributioPercentOfSalaryByContributor(c)
      ),
    };

    const promises = {
      netWorth: statement.getNetWorth(),
      assets: statement.getTotalAssetAmount(),
      liabilities: statement.getTotalLiabilityAmount(),
      lastYearAssetGrowth: statement.getLastYearAssetGrowth(),
      contributions,
    };

    return {
      year: statement.year,
      lastYearSalary: statement.lastYearSalary,
      ...(await deepResolveObject(promises)),
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
    const curCumilativeContributions: ContributionValues =
      this.contributors.reduce((acc, cur) => {
        acc[cur] = 0;
        return acc;
      }, {} as ContributionValues);

    for (const data of allData) {
      const { year, lastYearSalary } = data;
      netWorth.push({
        year,
        netWorth: data.netWorth,
        totalAssetAmount: data.assets,
        totalLiabilityAmount: data.liabilities,
      });

      assetGrowth.push({
        year,
        lastYearSalary,
        lastYearAssetGrowth: data.lastYearAssetGrowth,
      });

      const { amount, percentOfSalary } = data.contributions;
      contributionAmount.push({
        year,
        ...amount,
      });

      contributionPercentOfSalary.push({
        year,
        ...percentOfSalary,
      });

      this.contributors.forEach((contributor) => {
        curCumilativeContributions[contributor] += amount[contributor];
      });

      cumulativeContributionAmount.push({
        year,
        ...curCumilativeContributions,
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
