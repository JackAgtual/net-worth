"use client";

import { Dispatch, SetStateAction } from "react";
import { add, remove } from "../util";
import { Category } from "@/lib/db/types";

interface AssetsFormProps {
  assets: string[];
  setAssets: Dispatch<SetStateAction<string[]>>;
}

export default function AssetsForm({ assets, setAssets }: AssetsFormProps) {
  const addAsset = () => {
    add(setAssets);
  };

  const removeAsset = (id: string) => {
    remove(setAssets, id);
  };

  return (
    <div>
      <h1>Assets</h1>
      {assets.map((assetId, index) => {
        const count = index + 1;
        const getName = (field: string) => `asset_${count}_${field}`;
        return (
          <div key={assetId}>
            <label htmlFor={getName("name")}>Name</label>
            <input
              required
              type="text"
              name={getName("name")}
              id={getName("name")}
              className="border-2"
            />
            <label htmlFor={getName("amount")}>Amount</label>
            <input
              required
              type="number"
              name={getName("amount")}
              id={getName("amount")}
              className="border-2"
            />
            <label htmlFor={getName("category")}>Category</label>
            <select required name={getName("category")} id={getName("name")}>
              <option value="">Select a category</option>
              {Object.keys(Category).map((category) => {
                return (
                  <option value={category}>
                    {Category[category as keyof typeof Category]}
                  </option>
                );
              })}
            </select>
            <label htmlFor={getName("retirement")}>Retirement asset</label>
            <input
              id={getName("retirement")}
              name={getName("retirement")}
              type="checkbox"
            />
            <label htmlFor={getName("amountOneYearAgo")}>
              Amount one year ago
            </label>
            <input
              id={getName("amountOneYearAgo")}
              name={getName("amountOneYearAgo")}
              type="number"
              className="border-2"
            />
            <label htmlFor={getName("selfContribution")}>
              Self contributions
            </label>
            <input
              id={getName("selfContribution")}
              name={getName("selfContribution")}
              type="number"
              className="border-2"
            />
            <label htmlFor={getName("nonSelfContribution")}>
              Non self contributions
            </label>
            <input
              id={getName("nonSelfContribution")}
              name={getName("nonSelfContribution")}
              type="number"
              className="border-2"
            />
            <label htmlFor={getName("includeInGrowthCalculation")}>
              Include in growth calculation
            </label>
            <input
              id={getName("includeInGrowthCalculation")}
              name={getName("includeInGrowthCalculation")}
              type="checkbox"
            />
            <label htmlFor={getName("notes")}>Notes</label>
            <textarea
              name={getName("notes")}
              id={getName("name")}
              className="border-2"
            ></textarea>
            <button onClick={() => removeAsset(assetId)}>Remove asset</button>
          </div>
        );
      })}
      <button onClick={addAsset} type="button" className="border-2">
        Add asset
      </button>
    </div>
  );
}
