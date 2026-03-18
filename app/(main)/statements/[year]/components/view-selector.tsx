"use client";

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ViewSelector() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "table";

  return (
    <>
      <h1>Select view</h1>
      <RadioGroup value={view} className="flex">
        <Link href="?view=table">
          <FieldLabel htmlFor="table">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Table</FieldTitle>
              </FieldContent>
              <RadioGroupItem value="table" id="table" />
            </Field>
          </FieldLabel>
        </Link>
        <Link href="?view=chart">
          <FieldLabel htmlFor="chart">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Chart</FieldTitle>
              </FieldContent>
              <RadioGroupItem value="chart" id="chart" />
            </Field>
          </FieldLabel>
        </Link>
      </RadioGroup>
    </>
  );
}
