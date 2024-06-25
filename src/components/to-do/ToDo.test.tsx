import { describe, expect, test } from "vitest";
import { ToDo } from "./ToDo";
import { render, screen } from "@testing-library/react";
import { UserEvent, userEvent } from "@testing-library/user-event";
import { ReactNode } from "react";

function setup(jsx: ReactNode) {
  render(jsx);
  return {
    user: userEvent.setup(),
    title: screen.getByTestId("title"),
    input: screen.getByTestId("input-element"),
    button: screen.getByTestId("button-element"),
  };
}

export async function mockSubmitAction(
  user: UserEvent,
  input: HTMLElement,
  button: HTMLElement
) {
  await user.type(input, "First Task");
  await user.click(button);

  await user.type(input, "Second Task");
  await user.click(button);

  await user.type(input, "Third Task");
  await user.click(button);
}

describe("Tests for ToDo", () => {
  test("Title Rendered Correctly", async () => {
    const { user, title, input } = setup(<ToDo />);

    expect(title).toBeInTheDocument();
    await user.type(input, "Jane Doe");
    expect(input).toHaveValue("Jane Doe");
  });

  test("Should have an input", () => {
    const { input } = setup(<ToDo />);

    expect(input).toBeInTheDocument();
  });

  test("Should have a button", () => {
    const { button } = setup(<ToDo />);

    expect(button).toBeInTheDocument();
  });

  describe("Tests for input and button", () => {
    test("Input should be focused by default", () => {
      const { input } = setup(<ToDo />);
      expect(input).toHaveFocus();
    });

    test("Input should be empty by default", () => {
      const { input } = setup(<ToDo />);
      expect(input).toHaveValue("");
    });

    test("Submit button should be disabled if input is empty", () => {
      const { button } = setup(<ToDo />);
      expect(button).toBeDisabled();
    });

    test("Input should be showing what is typed", async () => {
      const { user, input } = setup(<ToDo />);
      await user.type(input, "Jane Doe");

      expect(input).toHaveValue("Jane Doe");
    });

    test("Submit button should be enabled when something is typed in the input", async () => {
      const { user, button, input } = setup(<ToDo />);
      expect(button).toBeDisabled();

      await user.type(input, "Jane Doe");
      expect(input).toHaveValue("Jane Doe");
      expect(button).toBeEnabled();
    });
  });

  describe("New ToDos", () => {
    test("Should add a new ToDo when the submit button is clicked", async () => {
      const { user, button, input } = setup(<ToDo />);
      await mockSubmitAction(user, input, button);
      expect(screen.getByText("First Task")).toBeInTheDocument();
      expect(screen.getByText("Second Task")).toBeInTheDocument();
      expect(screen.getByText("Third Task")).toBeInTheDocument();
    });

    test("Input should be focused after onSubmit", async () => {
      const { user, input, button } = setup(<ToDo />);
      await mockSubmitAction(user, input, button);
      expect(input).toHaveFocus();
    });

    test("Button should be disabled after submit", async () => {
      const { user, input, button } = setup(<ToDo />);
      await mockSubmitAction(user, input, button);
      expect(button).toBeDisabled();
    });
  });
});
