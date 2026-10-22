# The Daily Harvest

The Daily Harvest is a small fruit-shopping application built with React, TypeScript, React Router, and Vite. Product details are served as static JSON files; the cart is held in React context while the app is running.

## Quick Start Guide

### Before you begin

1. Install Node.js 18 or newer. npm is included with Node.js.
2. Open a terminal (in VS Code, select **Terminal > New Terminal**).
3. Check that Node.js and npm are available:

   ```bash
   node --version
   npm --version
   ```

The first command should report version 18 or newer. If either command is not recognized, install or repair Node.js, then open a new terminal.

### Install and start the app

In the terminal, move into the app folder. If your terminal is already in the repository root:

```bash
cd eCommApp
```

Install the exact dependencies recorded for this project:

```bash
npm ci
```

When installation finishes, start the development server:

```bash
npm run dev
```

Vite opens the app in your browser at [http://localhost:3000](http://localhost:3000). Keep the terminal running while you work; Vite refreshes the page when you save changes. To stop the server, press `Ctrl+C` in that terminal.

If you open a new terminal for other commands, move into `eCommApp` there too before running an npm script.

## Running Tests

Tests use Vitest and React Testing Library. The current example is [`src/components/CartPage.test.tsx`](./src/components/CartPage.test.tsx), which checks that cart items are displayed.

Run the full suite once (useful before committing or when checking a change):

```bash
npm run test:run
```

Run only the cart page test file:

```bash
npm run test:run -- src/components/CartPage.test.tsx
```

Run only a test whose name matches the given text:

```bash
npm run test:run -- -t "displays cart items"
```

For interactive development, start Vitest in watch mode. It stays open and reruns relevant tests when files change; press `q` to quit:

```bash
npm run test
```

To see a coverage report:

```bash
npm run test:coverage
```

The coverage command prints a summary in the terminal and generates report files under `coverage/`.

## Common Commands

Run these from the `eCommApp` directory:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run lint` | Run ESLint on the TypeScript and TSX files. |
| `npm run test` | Start Vitest in watch mode. |
| `npm run test:run` | Run the Vitest suite once. |
| `npm run test:ui` | Open the Vitest UI. |
| `npm run test:coverage` | Run tests and report coverage. |
| `npm run build` | Type-check with TypeScript and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally; run `npm run build` first. |

Before sharing a change, run:

```bash
npm run lint
npm run test:run
npm run build
```

## Where to Start

| Location | What it contains |
| --- | --- |
| [`src/main.tsx`](./src/main.tsx) | Application entry point and browser-router setup. |
| [`src/App.tsx`](./src/App.tsx) | Routes for the home, products, login, admin, and cart pages; also provides the cart context. |
| [`src/components/`](./src/components/) | Page components and shared UI such as the header, footer, and modals. |
| [`src/context/CartContext.tsx`](./src/context/CartContext.tsx) | Cart state and add/clear operations. Cart contents are in memory and reset when the app reloads. |
| [`src/types/`](./src/types/) | Shared TypeScript types. |
| [`src/utils/`](./src/utils/) | Shared utility functions. |
| [`src/test/`](./src/test/) | Vitest setup and shared test utilities. |
| [`src/components/CartPage.test.tsx`](./src/components/CartPage.test.tsx) | Example component test. |
| [`public/products/`](./public/products/) | Product JSON data loaded by the products page. |
| [`public/products/productImages/`](./public/products/productImages/) | Product images referenced by the JSON data. |
| [`package.json`](./package.json) | Dependencies and available npm scripts. |
| [`vite.config.ts`](./vite.config.ts) | Vite server, build, and Vitest configuration. |

To add or edit a product, update its JSON file in `public/products/` and make sure its image filename matches a file in `public/products/productImages/`. The products page loads the product JSON files by filename.

## Troubleshooting

- **`node` or `npm` is not recognized:** Install Node.js 18 or newer, close and reopen the terminal, and check again with `node --version` and `npm --version`.
- **PowerShell says scripts are disabled when you run `npm`:** Use the Windows command shim instead (for example, `npm.cmd ci` or `npm.cmd run test:run`), or open a Command Prompt terminal and use the regular `npm` commands.
- **`npm ci` fails:** Make sure the terminal is in the `eCommApp` folder (`cd eCommApp` from the repository root) and that you have an internet connection for the initial dependency download. Read the first error in the terminal output for details.
- **An npm script cannot find `package.json`:** Change to the app directory and retry:

  ```bash
  cd eCommApp
  ```

- **The app does not open at port 3000:** Another program may be using the port. Check the Vite terminal output for the actual local URL; Vite may choose another available port.
- **Products or images are missing:** Check that product JSON files are in `public/products/` and that referenced images are in `public/products/productImages/`.
- **Vitest reports no tests found:** Tests use the `.test.ts` or `.test.tsx` filename pattern. The current test is `src/components/CartPage.test.tsx`; run it with the targeted command above.
- **Preview has no build to serve:** Run `npm run build` before `npm run preview`.
