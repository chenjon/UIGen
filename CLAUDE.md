# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface, and the AI generates React code that renders in real-time.

## Commands

```bash
npm run setup      # Install deps + generate Prisma client + run migrations
npm run dev        # Start dev server with Turbopack (http://localhost:3000)
npm run build      # Production build
npm run lint       # ESLint
npm test           # Run all tests with Vitest
npm test -- --run  # Run tests once (no watch)
npm test -- path/to/file.test.ts  # Run specific test file
npm run db:reset   # Reset database
```

## Architecture

### AI Chat Flow
1. User sends message via chat interface (`ChatProvider` in `src/lib/contexts/chat-context.tsx`)
2. Request goes to `/api/chat` route with message history and serialized virtual file system
3. API uses Vercel AI SDK's `streamText` with Claude (or mock provider if no API key)
4. AI has two tools: `str_replace_editor` (view/create/edit files) and `file_manager` (rename/delete)
5. Tool calls are processed client-side by `FileSystemProvider` to update the virtual file system
6. Preview iframe re-renders when files change

### Virtual File System
- `VirtualFileSystem` class (`src/lib/file-system.ts`) provides an in-memory file system
- Files exist only in browser memory (no disk writes)
- Serializes to/from JSON for API transport and database persistence
- Context provider (`FileSystemContext`) wraps the VFS and exposes React-friendly operations

### JSX Transform & Preview
- `jsx-transformer.ts` uses Babel standalone to transpile JSX/TSX in the browser
- Creates import map with blob URLs for each transformed file
- Third-party imports resolve via esm.sh CDN
- Preview renders in sandboxed iframe with Tailwind CSS loaded from CDN

### Database
- SQLite via Prisma (schema in `prisma/schema.prisma`)
- Prisma client generated to `src/generated/prisma`
- Two models: `User` (auth) and `Project` (stores messages and file system as JSON)

### Authentication
- JWT-based sessions using `jose` library
- Cookie-based token storage (`src/lib/auth.ts`)
- Anonymous users can use the app but can't persist projects

### Mock Provider
When `ANTHROPIC_API_KEY` is not set, the app uses `MockLanguageModel` (`src/lib/provider.ts`) that returns static component code. This allows development without API costs.

## Key Directories

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (chat, editor, preview, auth, UI primitives)
- `src/lib/` - Core utilities (file system, auth, AI provider, contexts, tools)
- `src/lib/tools/` - AI tool definitions for file operations
- `src/lib/transform/` - JSX/TSX browser transpilation
- `src/actions/` - Server actions for project CRUD

## Code Style

- Use comments sparingly. Only comment complex code.
