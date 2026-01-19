"use client";

import { Dispatch, SetStateAction } from "react";
import { add, remove } from "../util";

interface LiabilitiesFormProps {
  liabilities: string[];
  setLiabilities: Dispatch<SetStateAction<string[]>>;
}

export default function LiabilitiesForm({
  liabilities,
  setLiabilities,
}: LiabilitiesFormProps) {
  const addLiability = () => {
    add(setLiabilities);
  };

  const removeLiability = (id: string) => {
    remove(setLiabilities, id);
  };

  return (
    <div>
      <h1>Liabilities</h1>
      {liabilities.map((liabilityId, index) => {
        const count = index + 1;
        const getName = (field: string) => `liability_${count}_${field}`;
        return (
          <div key={liabilityId}>
            <label htmlFor={getName("name")}>Name</label>
            <input type="text" name={getName("name")} className="border-2" />
            <label htmlFor={getName("amount")}>Amount</label>
            <input
              type="number"
              name={getName("amount")}
              className="border-2"
            />
            <label htmlFor={getName("notes")}>Notes</label>
            <textarea name={getName("notes")} className="border-2"></textarea>
            <button onClick={() => removeLiability(liabilityId)}>
              Remove liability
            </button>
          </div>
        );
      })}
      <button onClick={addLiability} type="button" className="border-2">
        Add liability
      </button>
    </div>
  );
}
