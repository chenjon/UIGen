import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallIndicator } from "../ToolCallIndicator";

afterEach(() => {
  cleanup();
});

// === str_replace_editor tests ===

test("displays 'Creating' message for create command", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("displays 'Viewing' message for view command", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "view", path: "/components/Card.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Viewing /components/Card.jsx")).toBeDefined();
});

test("displays 'Editing' message for str_replace command", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/utils/helpers.ts" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Editing /utils/helpers.ts")).toBeDefined();
});

test("displays 'Editing' message for insert command", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "insert", path: "/index.tsx", insert_line: 5 },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Editing /index.tsx")).toBeDefined();
});

test("displays 'Reverting' message for undo_edit command", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "undo_edit", path: "/App.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Reverting /App.jsx")).toBeDefined();
});

// === file_manager tests ===

test("displays 'Moving' message for rename with new_path", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Moving /old.jsx to /new.jsx")).toBeDefined();
});

test("displays 'Renaming' message for rename without new_path", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        args: { command: "rename", path: "/file.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Renaming /file.jsx")).toBeDefined();
});

test("displays 'Deleting' message for delete command", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        args: { command: "delete", path: "/unused.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Deleting /unused.jsx")).toBeDefined();
});

// === State indicator tests ===

test("shows spinner when state is 'call'", () => {
  const { container } = render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "call",
      }}
    />
  );
  expect(container.querySelector(".animate-spin")).not.toBeNull();
});

test("shows spinner when state is 'partial-call'", () => {
  const { container } = render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "partial-call",
      }}
    />
  );
  expect(container.querySelector(".animate-spin")).not.toBeNull();
});

test("shows success indicator when state is 'result' with result", () => {
  const { container } = render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "File created successfully",
      }}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// === Edge cases ===

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "unknown_tool",
        args: { some: "arg" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("handles string args by parsing JSON", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: JSON.stringify({ command: "create", path: "/parsed.jsx" }),
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Creating /parsed.jsx")).toBeDefined();
});

test("handles invalid JSON string args gracefully", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: "not valid json",
        state: "call",
      }}
    />
  );
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("handles missing path gracefully", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Creating file")).toBeDefined();
});

test("handles empty args object", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: {},
        state: "call",
      }}
    />
  );
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});
