import { StatementForm } from "@/lib/types/statement-types";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import LiabilitiesForm from "./liabilities-form";

function TestForm() {
  const { control } = useForm<StatementForm>();
  return <LiabilitiesForm control={control} />;
}

describe("LiabilitiesForm", () => {
  const titlePlaceholder = "Credit card 1";
  const addLiabilityText = /add liability/i;
  const removeLiabilityText = /remove liability/i;

  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    render(<TestForm />);
  });

  it("renders Add Liability button", () => {
    expect(
      screen.getByRole("button", { name: addLiabilityText })
    ).toBeInTheDocument();
  });

  it("defaults to zero liability forms", () => {
    expect(screen.queryByPlaceholderText(titlePlaceholder)).toBeNull();
  });

  it("adds liability form when Add Liability button is clicked", async () => {
    await user.click(screen.getByRole("button", { name: addLiabilityText }));
    expect(screen.getAllByPlaceholderText(titlePlaceholder)).toHaveLength(1);
  });

  it("adds multiple liability forms when Add Liability button is clicked multiple times", async () => {
    const addLiability = screen.getByRole("button", { name: addLiabilityText });
    await user.click(addLiability);
    await user.click(addLiability);
    expect(screen.getAllByPlaceholderText(titlePlaceholder)).toHaveLength(2);
  });

  it("renders Remove Liability button for each liability", async () => {
    const addLiability = screen.getByRole("button", { name: addLiabilityText });
    await user.click(addLiability);
    await user.click(addLiability);
    expect(
      screen.getAllByRole("button", { name: removeLiabilityText })
    ).toHaveLength(2);
  });

  it("removes correct liability form when Remove Liability button is clicked", async () => {
    const addLiability = screen.getByRole("button", { name: addLiabilityText });
    await user.click(addLiability);
    await user.click(addLiability);

    const titleInputs = screen.getAllByPlaceholderText(titlePlaceholder);
    await user.type(titleInputs[0], "First Liability");
    await user.type(titleInputs[1], "Second Liability");

    const removeButtons = screen.getAllByRole("button", {
      name: removeLiabilityText,
    });
    await user.click(removeButtons[0]);

    expect(screen.queryByDisplayValue("First Liability")).toBeNull();
    expect(screen.getByDisplayValue("Second Liability")).toBeInTheDocument();
  });

  it("removes all liability forms when all are removed", async () => {
    const addLiability = screen.getByRole("button", { name: addLiabilityText });
    await user.click(addLiability);

    const titleInput = screen.getByPlaceholderText(titlePlaceholder);
    await user.type(titleInput, "Only Liability");

    await user.click(screen.getByRole("button", { name: removeLiabilityText }));
    expect(screen.queryByPlaceholderText(titlePlaceholder)).toBeNull();
    expect(screen.queryByDisplayValue("Only Liability")).toBeNull();
  });

  it("renders separator between liabilities but not after last one", async () => {
    const addLiability = screen.getByRole("button", { name: addLiabilityText });
    await user.click(addLiability);
    await user.click(addLiability);
    expect(document.querySelectorAll("[data-slot=separator]")).toHaveLength(1);
  });

  it("renders Liabilities legend", () => {
    expect(screen.getByText("Liabilities")).toBeInTheDocument();
  });
});
