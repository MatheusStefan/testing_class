import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditableInput } from "./EditableInput";
import "@testing-library/jest-dom";

type Item = {
  id: number;
  text: string;
};

type Props = {
  item: Item;
  handleDelete: (id: number) => () => void;
  handleEdit: (id: number, text: string) => void;
};

function setupEditableInput(props: Props) {
  render(<EditableInput {...props} />);
  return {
    user: userEvent.setup(),
    editButton: screen.getByTestId("editButton"),
    deleteButton: screen.getByTestId("deleteButton"),
    applyButton: screen.queryByTestId("applyButton"),
    cancelButton: screen.queryByTestId("cancelButton"),
  };
}

describe("Tests for EditableInput", () => {
  const item: Item = { id: 1, text: "Sample Task" };
  const handleDelete = vi.fn((id: number) => () => {});
  const handleEdit = vi.fn((id: number, text: string) => {});

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test("Initial render: input should not be visible, only edit and delete buttons should be visible", () => {
    setupEditableInput({ item, handleDelete, handleEdit });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByTestId("editButton")).toBeInTheDocument();
    expect(screen.getByTestId("deleteButton")).toBeInTheDocument();
    expect(screen.queryByTestId("applyButton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cancelButton")).not.toBeInTheDocument();
  });

  test("Clicking edit button should render input and apply/cancel buttons", async () => {
    const { user, editButton } = setupEditableInput({
      item,
      handleDelete,
      handleEdit,
    });
    await user.click(editButton);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("applyButton")).toBeInTheDocument();
    expect(screen.getByTestId("cancelButton")).toBeInTheDocument();
    expect(screen.queryByTestId("editButton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("deleteButton")).not.toBeInTheDocument();
  });

  test("Clicking cancel button should hide input and apply/cancel buttons, show edit and delete buttons", async () => {
    const { user, editButton } = setupEditableInput({
      item,
      handleDelete,
      handleEdit,
    });
    await user.click(editButton);

    const cancelButton = screen.getByTestId("cancelButton");
    await user.click(cancelButton);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByTestId("editButton")).toBeInTheDocument();
    expect(screen.getByTestId("deleteButton")).toBeInTheDocument();
    expect(screen.queryByTestId("applyButton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cancelButton")).not.toBeInTheDocument();
  });

  test("Clicking apply button should hide input and apply/cancel buttons, show edit and delete buttons", async () => {
    const { user, editButton } = setupEditableInput({
      item,
      handleDelete,
      handleEdit,
    });
    await user.click(editButton);

    const applyButton = screen.getByTestId("applyButton");
    await user.click(applyButton);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByTestId("editButton")).toBeInTheDocument();
    expect(screen.getByTestId("deleteButton")).toBeInTheDocument();
    expect(screen.queryByTestId("applyButton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cancelButton")).not.toBeInTheDocument();
  });

  test("Editing and applying input should reflect changes", async () => {
    const { user, editButton } = setupEditableInput({
      item,
      handleDelete,
      handleEdit,
    });
    await user.click(editButton);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "New Value");

    const applyButton = screen.getByTestId("applyButton");
    await user.click(applyButton);

    expect(handleEdit).toHaveBeenCalledWith(item.id, "New Value");
    expect(screen.getByText("New Value")).toBeInTheDocument();
  });

  test("Editing and canceling input should not reflect changes", async () => {
    const { user, editButton } = setupEditableInput({
      item,
      handleDelete,
      handleEdit,
    });
    await user.click(editButton);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "New Value");

    const cancelButton = screen.getByTestId("cancelButton");
    await user.click(cancelButton);

    expect(handleEdit).not.toHaveBeenCalled();
    expect(screen.getByText("New Value")).toBeInTheDocument();
  });

  test("Clicking delete button should call handleDelete with correct id", async () => {
    const { user, deleteButton } = setupEditableInput({
      item,
      handleDelete,
      handleEdit,
    });
    await user.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledWith(item.id);
  });
});
