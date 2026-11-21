import { AssetCategory } from "@/generated/prisma/enums";
import { Numberify } from "../db/numberify";
import {
  getContributionAmountByContributor,
  getContributioPercentOfSalaryByContributor,
  getLastYearAssetGrowth,
  getLastYearAssetGrowthPercentOfSalary,
  getNetContributions,
  getNetContributionsPercentOfSalary,
  getNetWorth,
  getPercentOfAssetsByCategory,
  getTotalAssetAmount,
  getTotalAssetAmountByCategory,
  getTotalLiabilityAmount,
  getTotalLiabilityGrowthFromInterest,
  getTotalLiabilityGrowthFromInterestPercentOfSalary,
  getTotalLiabilityPaymentsMade,
  getTotalLiabilityPaymentsMadePercentOfSalary,
  getTotalWithdrawals,
  getTotalWithdrawalsPercentOfSalary,
} from "../db/statement";
import {
  AssetGrowthChartData,
  CategoryChartData,
  ContributionAndWithdrawalAmountChartData,
  ContributionAndWithdrawalPercentChartData,
  ContributionValues,
  NetWorthChartData,
} from "../types/chart-data-types";
import { Contributor, FullStatement } from "../types/types";

export class StatementDataAggregator {
  mostRecentStatement: Numberify<FullStatement>;
  statements: Numberify<FullStatement>[];

  static contributors = Object.values(Contributor);

  constructor(statements: Numberify<FullStatement>[]) {
    if (statements.length === 0) {
      throw new Error(
        "StatementDataAggregator requires a non-empty statement array"
      );
    }
    this.statements = statements;
    this.mostRecentStatement = statements[statements.length - 1];
  }

  static getAllDataFromStatement(statement: Numberify<FullStatement>) {
    const mapContributions = <T>(fn: (c: Contributor) => T) => {
      return Object.fromEntries(
        StatementDataAggregator.contributors.map((contributor) => [
          contributor,
          fn(contributor),
        ])
      ) as Record<Contributor, T>;
    };

    const mapCategories = <T>(fn: (c: AssetCategory) => T) => {
      return Object.fromEntries(
        Object.values(AssetCategory).map((category) => [category, fn(category)])
      ) as Record<AssetCategory, T>;
    };

    const contributions = {
      amount: mapContributions((c) =>
        getContributionAmountByContributor(statement, c)
      ),
      percentOfSalary: mapContributions((c) =>
        getContributioPercentOfSalaryByContributor(statement, c)
      ),
    };

    const categories = {
      amount: mapCategories((c) => getTotalAssetAmountByCategory(statement, c)),
      percent: mapCategories((c) => getPercentOfAssetsByCategory(statement, c)),
    };

    return {
      year: statement.year,
      lastYearSalary: statement.lastYearSalary,
      netWorth: getNetWorth(statement),
      assetAmount: getTotalAssetAmount(statement),
      liabilityAmount: getTotalLiabilityAmount(statement),
      lastYearAssetGrowth: getLastYearAssetGrowth(statement),
      lastYearAssetGrowthPercentOfSalary:
        getLastYearAssetGrowthPercentOfSalary(statement),
      categories,
      contributions,
      withdrawals: {
        amount: getTotalWithdrawals(statement),
        percentOfSalary: getTotalWithdrawalsPercentOfSalary(statement),
      },
      netContributions: {
        amount: getNetContributions(statement),
        percentOfSalary: getNetContributionsPercentOfSalary(statement),
      },
      liabilityPaymentData: {
        paymentsMade: {
          amount: getTotalLiabilityPaymentsMade(statement),
          percentOfSalary:
            getTotalLiabilityPaymentsMadePercentOfSalary(statement),
        },
        growthFromInterest: {
          amount: getTotalLiabilityGrowthFromInterest(statement),
          percentOfSalary:
            getTotalLiabilityGrowthFromInterestPercentOfSalary(statement),
        },
      },
    };
  }

  async getMostRecentStatementData() {
    return StatementDataAggregator.getAllDataFromStatement(
      this.mostRecentStatement
    );
  }

  async getPlotData() {
    const allData = await Promise.all(
      this.statements.map(async (statement) => {
        return StatementDataAggregator.getAllDataFromStatement(statement);
      })
    );

    const netWorth: NetWorthChartData[] = [];
    const assetGrowth: AssetGrowthChartData[] = [];
    const categoryPercentage: CategoryChartData[] = [];
    const contributionWithdrawalAmount: ContributionAndWithdrawalAmountChartData[] =
      [];
    const cumulativeContributionWithdrawalAmount: ContributionAndWithdrawalAmountChartData[] =
      [];
    const contributionWithdrawalPercentOfSalary: ContributionAndWithdrawalPercentChartData[] =
      [];
    const curCumilativeContributions: ContributionValues =
      StatementDataAggregator.contributors.reduce((acc, cur) => {
        acc[cur] = 0;
        return acc;
      }, {} as ContributionValues);
    let curCumulativeWithdrawals = 0;
    let curNetContributions = 0;

    for (const data of allData) {
      const { year, lastYearSalary } = data;
      netWorth.push({
        year,
        netWorth: data.netWorth,
        totalAssetAmount: data.assetAmount,
        totalLiabilityAmount: data.liabilityAmount,
      });

      assetGrowth.push({
        year,
        lastYearSalary,
        lastYearAssetGrowth: data.lastYearAssetGrowth,
      });

      categoryPercentage.push({
        year,
        ...data.categories.percent,
      });

      const { contributions, withdrawals, netContributions } = data;

      contributionWithdrawalAmount.push({
        year,
        ...contributions.amount,
        withdrawals: withdrawals.amount,
        netContributions: netContributions.amount,
      });

      contributionWithdrawalPercentOfSalary.push({
        year,
        ...contributions.percentOfSalary,
        withdrawals: withdrawals.percentOfSalary,
        netContributions: netContributions.percentOfSalary,
      });

      curNetContributions += netContributions.amount;
      curCumulativeWithdrawals += withdrawals.amount;
      StatementDataAggregator.contributors.forEach((contributor) => {
        curCumilativeContributions[contributor] +=
          contributions.amount[contributor];
      });

      cumulativeContributionWithdrawalAmount.push({
        year,
        ...curCumilativeContributions,
        withdrawals: curCumulativeWithdrawals,
        netContributions: curNetContributions,
      });
    }

    return {
      netWorth,
      assetGrowth,
      categoryPercentage,
      contributionWithdrawalAmount,
      contributionWithdrawalPercentOfSalary,
      cumulativeContributionWithdrawalAmount,
    };
  }

  getStatementOverviewData() {
    return this.statements.map((statement) => {
      return { year: statement.year, netWorth: getNetWorth(statement) };
    });
  }
}
