# WorkFlowBridge

> A lightweight React + Vite app for managing workflows across clients, employees, managers and admins.

## Summary

WorkFlowBridge is a frontend application scaffolded with Vite and React. It includes routing for multiple dashboard roles (Admin, Manager, Employee, Client) and pages for authentication and registration. TailwindCSS and Axios are used for styling and API calls.

## Features

- Role-based dashboard pages (Admin, Manager, Employee, Client)
- Authentication and registration pages
- TailwindCSS for utility-first styling
- Vite for fast development and build

## Repository Structure

- `src/` — application source files
  - `pages/` — route pages (AdminDashboard, ManagerDashboard, EmployeeDashboard, ClientDashboard, Home, LoginPage, RegisterPage)
  - `api/` — API client helpers
  - `assets/` — static assets

## Getting Started

Prerequisites:

- Node.js (recommended 18+)

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Lint the project:

```bash
npm run lint
```

## Available NPM Scripts

- `dev`: Starts Vite dev server
- `build`: Builds the production bundle with Vite
- `preview`: Serves the built production bundle locally
- `lint`: Runs ESLint across the project

## Tech Stack

- React
- Vite
- Tailwind CSS
- Axios
- ESLint

## Contributing

Contributions are welcome. Open an issue or submit a pull request describing the change.

## License

This project does not include a license file. Add a `LICENSE` if you plan to open-source it.

---

If you'd like, I can add a short Getting Started GIF, CI workflow, or a `LICENSE` file next.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
