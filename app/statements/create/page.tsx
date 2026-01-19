"use client";

import { createStatement } from "@/lib/actions/statement-actions";
import { checkSessionClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import LiabilitiesForm from "./components/liability-form";
import AssetsForm from "./components/assets-form";

export default function Page() {
  //   const session = checkSessionClient();

  const [liabilities, setLiabilities] = useState<string[]>([]);
  const [assets, setAssets] = useState<string[]>([]);

  const createStatementWithCounts = createStatement.bind(
    null,
    assets.length,
    liabilities.length
  );
  return (
    <form action={createStatementWithCounts} className="flex-col">
      <h1>General info</h1>
      <div>
        <label htmlFor="year">Year</label>
        <input
          id="year"
          name="year"
          type="number"
          required
          className="border-2"
        />
        <label htmlFor="lastYearSalary">Last year salary</label>
        <input
          id="lastYearSalary"
          name="lastYearSalary"
          type="number"
          className="border-2"
        />
      </div>
      <AssetsForm assets={assets} setAssets={setAssets} />
      <LiabilitiesForm
        liabilities={liabilities}
        setLiabilities={setLiabilities}
      />
      <button type="submit" className="border-2">
        Create
      </button>
    </form>
  );
}
