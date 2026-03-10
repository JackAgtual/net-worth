import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import { useForm } from "react-hook-form";
import DollarInput from "./DollarInput";

function TestForm({ defaultValue }: { defaultValue?: number }) {
  const { control } = useForm({
    defaultValues: { amount: defaultValue },
  });
  return <DollarInput name="amount" label="Amount" control={control} />;
}

describe("DollarInput", () => {
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders label", () => {
    render(<TestForm />);
    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  it("formats number with commas", async () => {
    render(<TestForm />);
    const el = screen.getByRole("textbox");
    await user.type(el, "1500");
    expect(el).toHaveValue("1,500");
  });

  it("clears to empty string when all characters deleted", async () => {
    render(<TestForm defaultValue={100} />);
    const el = screen.getByRole("textbox");
    await user.clear(el);
    expect(el).toHaveValue("");
  });

  it("ignores non-numeric characters", async () => {
    render(<TestForm />);
    const el = screen.getByRole("textbox");
    await user.type(el, "abc");
    expect(el).toHaveValue("");
  });

  it("allows one decimal to be typed (zero ending)", async () => {
    render(<TestForm />);
    const el = screen.getByRole("textbox");
    await user.type(el, "0.....40");
    expect(el).toHaveValue("0.40");
  });

  it("allows one decimal to be typed (non-zero ending)", async () => {
    render(<TestForm />);
    const el = screen.getByRole("textbox");
    await user.type(el, "0.....99");
    expect(el).toHaveValue("0.99");
  });

  it("adds 0 before decimal if decimal is only character entered", async () => {
    render(<TestForm />);
    const el = screen.getByRole("textbox");
    await user.type(el, ".");
    expect(el).toHaveValue("0.");
  });

  it("only allows 2 decimal places", async () => {
    render(<TestForm />);
    const el = screen.getByRole("textbox");
    await user.type(el, "100500.12345678");
    expect(el).toHaveValue("100,500.12");
  });

  it("prepopulates with formatted value", () => {
    render(<TestForm defaultValue={5000} />);
    expect(screen.getByRole("textbox")).toHaveValue("5,000");
  });
});
