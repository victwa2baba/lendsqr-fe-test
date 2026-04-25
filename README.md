# react-next-template

A modern React application template built with **Next.js 16.1.6**, using the **App Router**, TypeScript, and Tailwind CSS.  
Designed for scalable, production-ready web applications, dashboards, SaaS products, and APIs.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `>= 18.18.0` (Node 20 LTS recommended)
- **Yarn** (preferred) or npm
- **Git**

> ⚠️ Next.js 16 requires modern Node versions. Older Node 18 releases may cause build issues.

---

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Start the development server:

```bash
yarn dev
```

3. Open the app in your browser:

```
http://localhost:3000
```

---

## Tech Stack

- Next.js **16.1.6**
- React **19**
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- Sass (SCSS)

---

## Available Scripts

| Command      | Description                   |
| ------------ | ----------------------------- |
| `yarn dev`   | Starts the development server |
| `yarn build` | Builds the app for production |
| `yarn start` | Runs the production server    |
| `yarn lint`  | Runs ESLint checks            |

---

## Project Structure

```
├── app/
│   ├── api/
│   ├── auth/
│   ├── head.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
├── contexts/
├── store/
├── lib/
├── public/
├── styles/
│   └── globals.scss
├── utils/
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## Directory Details

### /app

Built using the **Next.js App Router**:

- `layout.tsx` – Root layout and global wrappers
- `page.tsx` – Home route (`/`)
- `auth/*` – Authentication routes
- `api/*` – Route Handlers (server-only)
- `head.tsx` – Document-level metadata
- `not-found.tsx` – Custom 404 page
- `providers.tsx` – Global context providers

---

### /components

Reusable UI components shared across routes and features.

---

#### AuthContext

Handles authentication logic:

- Login and logout
- Session persistence
- Cookie-based token handling
- User state management

---

### /store (optional)

State management layer for larger or more complex application state.

This directory is optional and can be configured with one of the following:

#### Zustand

Recommended for lightweight, minimal-boilerplate global state.

Example structure:

```
store/
├── useAuthStore.ts
└── useAppStore.ts
```

Typical usage:

- Create stores as hooks
- Consume state directly in components without providers

---

### /lib

Shared TypeScript resources:

- Interfaces
- Types
- Constants
- Enums

---

### /utils

Helper utilities such as:

- API helpers
- Formatting utilities
- Shared helper functions

---

### /public

Static assets served directly by Next.js:

- Images
- Fonts
- Icons
- Favicon

---

### /styles

Styling configuration:

- Global SCSS
- Tailwind utilities
- Design tokens
- Theme variables

---

## Configuration Files

### proxy.ts

Reusable middleware helper for cookie-based route protection.

---

### next.config.ts

Next.js configuration including:

- Image optimization
- Redirects & rewrites
- Environment variables
- Build optimizations

---

### tailwind.config.ts

Tailwind CSS configuration:

- Custom themes
- Colors
- Typography
- Responsive breakpoints
- Plugins

---

### postcss.config.mjs

Build pipeline config used to process Tailwind directives in the SCSS entry stylesheet.

---

### tsconfig.json

TypeScript configuration:

- Strict typing rules
- Path aliases
- Compiler options
- Module resolution

---

### package.json

Project metadata and configuration:

- Scripts
- Dependencies
- Dev dependencies
- Next.js version (`16.1.6`)

---

## Notes

This template includes:

- A simple authentication flow
- API route handlers
- Context-based auth state management

You are free to extend, replace, or restyle components based on your project requirements.
