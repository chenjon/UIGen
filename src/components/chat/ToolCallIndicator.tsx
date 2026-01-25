"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown> | string;
  state: "partial-call" | "call" | "result";
  result?: unknown;
}

interface ToolCallIndicatorProps {
  toolInvocation: ToolInvocation;
}

function parseArgs(args: Record<string, unknown> | string): Record<string, unknown> {
  if (typeof args === "string") {
    try {
      return JSON.parse(args);
    } catch {
      return {};
    }
  }
  return args;
}

function getToolMessage(toolName: string, args: Record<string, unknown>): string {
  const command = args.command as string | undefined;
  const path = args.path as string | undefined;
  const newPath = args.new_path as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return `Creating ${path || "file"}`;
      case "view":
        return `Viewing ${path || "file"}`;
      case "str_replace":
        return `Editing ${path || "file"}`;
      case "insert":
        return `Editing ${path || "file"}`;
      case "undo_edit":
        return `Reverting ${path || "file"}`;
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        if (path && newPath) {
          return `Moving ${path} to ${newPath}`;
        }
        return `Renaming ${path || "file"}`;
      case "delete":
        return `Deleting ${path || "file"}`;
      default:
        return toolName;
    }
  }

  return toolName;
}

export function ToolCallIndicator({ toolInvocation }: ToolCallIndicatorProps) {
  const { toolName, args, state, result } = toolInvocation;
  const parsedArgs = parseArgs(args);
  const message = getToolMessage(toolName, parsedArgs);
  const isComplete = state === "result" && result !== undefined;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
