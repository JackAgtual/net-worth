/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import DollarInput from "./DollarInput";
import { useForm } from "react-hook-form";

function TestForm({ defaultValue }: { defaultValue?: number }) {
  const { control } = useForm({
    defaultValues: { amount: defaultValue },
  });
  return <DollarInput name="amount" label="Amount" control={control} />;
}

describe("DollarInput", () => {
  it("renders label", () => {
    render(<TestForm />);
    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  //   it("formats number with commas on type", async () => {
  //     const user = userEvent.setup();
  //     render(<TestForm />);
  //     await user.type(screen.getByRole("textbox"), "1500");
  //     expect(screen.getByRole("textbox")).toHaveValue("1,500");
  //   });

  //   it("clears to empty string when all characters deleted", async () => {
  //     const user = userEvent.setup();
  //     render(<TestForm defaultValue={100} />);
  //     await user.clear(screen.getByRole("textbox"));
  //     expect(screen.getByRole("textbox")).toHaveValue("");
  //   });

  //   it("ignores non-numeric characters", async () => {
  //     const user = userEvent.setup();
  //     render(<TestForm />);
  //     await user.type(screen.getByRole("textbox"), "abc");
  //     expect(screen.getByRole("textbox")).toHaveValue("");
  //   });

  //   it("prepopulates with formatted value", () => {
  //     render(<TestForm defaultValue={5000} />);
  //     expect(screen.getByRole("textbox")).toHaveValue("5,000");
  //   });

  //   it("allows user to delete all values", () => {});
});
