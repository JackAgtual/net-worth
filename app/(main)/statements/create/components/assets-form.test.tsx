import { StatementForm } from "@/lib/types/statement-types";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import AssetsForm from "./assets-form";

const TITLE_PLACEHOLDER = "Investment account";

function TestForm() {
  const { control } = useForm<StatementForm>();
  return <AssetsForm control={control} />;
}

describe("AssetsForm", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    render(<TestForm />);
  });

  it("renders Add Asset button", () => {
    expect(
      screen.getByRole("button", { name: /add asset/i })
    ).toBeInTheDocument();
  });

  it("defaults to zero asset forms", () => {
    expect(screen.queryByPlaceholderText(TITLE_PLACEHOLDER)).toBeNull();
  });

  it("adds asset form when Add Asset button is clicked", async () => {
    await user.click(screen.getByRole("button", { name: /add asset/i }));
    expect(screen.getAllByPlaceholderText(TITLE_PLACEHOLDER)).toHaveLength(1);
  });

  it("adds multiple asset forms when Add Asset button is clicked multiple times", async () => {
    const addAsset = screen.getByRole("button", { name: /add asset/i });
    await user.click(addAsset);
    await user.click(addAsset);
    expect(screen.getAllByPlaceholderText(TITLE_PLACEHOLDER)).toHaveLength(2);
  });

  it("renders Remove Asset button for each asset", async () => {
    const addAsset = screen.getByRole("button", { name: /add asset/i });
    await user.click(addAsset);
    await user.click(addAsset);
    expect(
      screen.getAllByRole("button", { name: /remove asset/i })
    ).toHaveLength(2);
  });

  it("removes correct asset form when Remove Asset button is clicked", async () => {
    const addAsset = screen.getByRole("button", { name: /add asset/i });
    await user.click(addAsset);
    await user.click(addAsset);

    const titleInputs = screen.getAllByPlaceholderText(TITLE_PLACEHOLDER);
    await user.type(titleInputs[0], "First Asset");
    await user.type(titleInputs[1], "Second Asset");

    const removeButtons = screen.getAllByRole("button", {
      name: /remove asset/i,
    });
    await user.click(removeButtons[0]);

    expect(screen.queryByDisplayValue("First Asset")).toBeNull();
    expect(screen.getByDisplayValue("Second Asset")).toBeInTheDocument();
  });

  it("removes all asset forms when all are removed", async () => {
    const addAsset = screen.getByRole("button", { name: /add asset/i });
    await user.click(addAsset);

    const titleInput = screen.getByPlaceholderText(TITLE_PLACEHOLDER);
    await user.type(titleInput, "Only Asset");

    await user.click(screen.getByRole("button", { name: /remove asset/i }));
    expect(screen.queryByPlaceholderText(TITLE_PLACEHOLDER)).toBeNull();
    expect(screen.queryByDisplayValue("Only Asset")).toBeNull();
  });

  it("renders separator between assets but not after last one", async () => {
    const addAsset = screen.getByRole("button", { name: /add asset/i });
    await user.click(addAsset);
    await user.click(addAsset);
    expect(document.querySelectorAll("[data-slot=separator]")).toHaveLength(1);
  });

  it("renders Assets legend", () => {
    expect(screen.getByText("Assets")).toBeInTheDocument();
  });
});
