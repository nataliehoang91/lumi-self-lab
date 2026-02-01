# Dependencies compatibility with Next.js 16.1.5

Checked: Jan 2026. All versions below are compatible with **Next.js 16.1.5** and **React 19**.

## Core (required by Next.js 16)

| Package       | Your version | Status | Notes                           |
|---------------|--------------|--------|---------------------------------|
| next          | 16.1.5       | OK     | Current stable                  |
| react         | ^19.2.4      | OK     | Next 16 uses React 19.2         |
| react-dom     | ^19.2.4      | OK     | Match react version             |
| typescript    | ^5           | OK     | Next 16 requires TypeScript 5.1+|
| Node.js       | —            | Check  | Next 16 requires **Node.js 20.9+** |

## Auth & API

| Package        | Your version | Status | Notes                                |
|----------------|--------------|--------|--------------------------------------|
| @clerk/nextjs  | ^6.37.1      | OK     | v6 supports Next 13+ and React 19   |
| svix           | ^1.84.1      | OK     | Webhook signing, framework-agnostic |

## Database

| Package         | Your version | Status | Notes                |
|-----------------|--------------|--------|----------------------|
| @prisma/client  | ^6.19.2      | OK     | 6.x compatible       |
| prisma          | ^6.19.2      | OK     | Match @prisma/client |

## Styling & UI

| Package               | Your version | Status | Notes                          |
|-----------------------|--------------|--------|--------------------------------|
| tailwindcss           | ^4.1.18      | OK     | Tailwind v4 works with Next 16 |
| @tailwindcss/postcss  | ^4.1.18      | OK     | Use with Tailwind v4           |
| postcss               | ^8.5.6       | OK     | PostCSS 8.x                    |
| @radix-ui/react-*     | ^1.x / ^2.x  | OK     | React 19 compatible            |
| lucide-react          | ^0.563.0     | OK     | Icons                          |
| class-variance-authority | ^0.7.1    | OK     | CVA for component variants     |
| clsx                  | ^2.1.1       | OK     | Class names                    |
| tailwind-merge        | ^3.4.0       | OK     | Merge Tailwind classes         |

## Other dependencies

| Package                | Your version | Status | Notes                                           |
|------------------------|--------------|--------|-------------------------------------------------|
| next-themes            | ^0.4.6       | OK     | App Router & React 19                          |
| sonner                 | ^2.0.7       | OK     | Toasts                                         |
| cmdk                   | ^1.1.1       | OK     | Command menu                                   |
| react-resizable-panels | 2.1.8        | OK     | Stay on 2.x; 4.x is major (breaking changes)   |
| react-error-boundary   | ^4.0.13      | OK     | 4.x fine; 6.x is major                         |
| @vercel/analytics      | ^1.6.1       | OK     | Vercel Analytics                               |

## Dev dependencies

| Package            | Your version | Status | Notes                    |
|--------------------|--------------|--------|--------------------------|
| eslint-config-next | 16.1.5       | OK     | Match Next.js version    |
| eslint             | ^9           | OK     | ESLint 9                 |
| @types/react       | ^19.2.10     | OK     | Use ^19 for React 19     |
| @types/react-dom   | ^19.2.10     | OK     | Match @types/react       |
| @types/node        | ^20          | OK     | Node 20 types            |
| tw-animate-css     | ^1.4.0       | OK     | CSS-only, zero deps; Tailwind v4 compatible |

## Do not upgrade without testing

- **react-resizable-panels** (2 → 4): major API changes.
- **react-error-boundary** (4 → 6): major API changes.
- **tw-animate-css** (1 → 2): v2 planned with breaking changes; stay on 1.x until migration guide.
