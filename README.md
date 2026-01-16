# Cogito 🧠 (CLI Edition)

“I think, therefore it is built.”

Cogito is an empathetic, OS-layer tuning application for non-technical thinkers, running directly in your terminal.

## Project Structure

- `package.json`: Metadata and dependencies.
- `tsconfig.json`: TypeScript configuration.
- `src/cli.tsx`: The main entry point for the CLI.
- `src/App.tsx`: The terminal UI, built with Ink and React.

## Setup Instructions

### 1. Prerequisites

- **Node.js & NPM**: Required for building and running the tool.

### 2. Local Installation & Usage

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Build the application:**
    ```bash
    npm run build
    ```

3.  **Run the CLI directly:**
    ```bash
    npm start
    ```

4.  **(Optional) Link for global access:**
    To use `cogito` as a command from anywhere, link it:
    ```bash
    npm link
    ```
    You can then run the application by simply typing:
    ```bash
    cogito
    ```

## How to Use

Once the application is running, you will be presented with an interactive text-based interface.

-   **Plan Mode**: Type your goal into the input field and press Enter. Cogito will draft a roadmap of shell commands.
-   **Build Mode**: After a roadmap is created, you will transition to Build Mode. Here, you can execute the planned steps one by one.