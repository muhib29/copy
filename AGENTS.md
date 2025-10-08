# Fusion Starter

Production-ready Next.js application with App Router APIs, TypeScript, Zod, and modern tooling.

The legacy Vite + Express setup has been removed. Use Next.js API routes under `app/api/*` for server logic.

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: Next.js 14 App Router + React 18 + TypeScript + TailwindCSS 3
- **Backend**: Next.js API routes (Edge/Node runtimes)
- **Testing**: (optional) add Playwright/Jest as needed
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # UI components and client libs
├── components/ui/        # Pre-built UI component library
├── lib/                  # Client utilities and API clients
└── global.css            # TailwindCSS 3 theming and global styles

app/                      # Next.js App Router (routes + APIs)
├── api/                  # API handlers (Mongo-backed)
├── collection/[slug]/    # Collection page
├── category/[slug]/      # Category page
└── page.tsx              # Home page

shared/                   # Types used by both client & server
└── api.ts                # Shared DTOs
```

## Key Features

## Routing System

Next.js App Router drives routing via the `app/` directory.

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### API Integration

- **API endpoints**: Prefixed with `/api/` under `app/api/*`

#### Example API Routes
- `GET /api/ping` - Simple ping api
- `GET /api/demo` - Demo endpoint  

### Shared Types
Import consistent types in both client and server:
```typescript
import { DemoResponse } from '@shared/api';
```

Path aliases:
- `@shared/*` - Shared folder
- `@/*` - Client folder

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test          # Run Vitest tests
```

### Environment Variables

Create a `.env.local` in the project root with:

```
MONGODB_URI=your-atlas-connection-string
MONGODB_DB=fusion
```

The admin API uses MongoDB Atlas for CRUD of collections, categories, and products.


## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route
1. **Optional**: Create a shared interface in `shared/api.ts`:
```typescript
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
```

2. Create a new route handler in `app/api/my-endpoint/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export async function GET() {
  const response: MyRouteResponse = { message: 'Hello from my endpoint!' };
  return NextResponse.json(response);
}
```

3. Use in React components with type safety:
```typescript
import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

const response = await fetch('/api/my-endpoint');
const data: MyRouteResponse = await response.json();
```

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Standard**: `pnpm build`
- **Binary**: Self-contained executables (Linux, macOS, Windows)
- **Cloud Deployment**: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.

## Architecture Notes

- Next.js App Router + API routes
- TypeScript throughout (client, server, shared)
- Hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces
