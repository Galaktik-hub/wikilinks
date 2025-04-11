# WikiLinks Development Guide

This guide provides step-by-step instructions on setting up and developing the WikiLinks project. Follow these steps to get your development environment ready and running.

## Prerequisites

Before you begin, ensure that you have the following installed on your machine:

- Node.js: Download and install the latest LTS version from [nodejs.org](nodejs.org).
- npm: Comes bundled with Node.js, but ensure it is updated by running:

```bash
  npm install -g npm
```

## Installation Steps

### Install Dependencies

The project uses npm for dependency management. To install all project dependencies, run:

```bash
  npm install
```

## Running the Development Server

To start the development server, with only the Frontend, run:

```bash
  npm run dev
```

If you need the server to be accessible to your local network, use:

```bash
  npm run dev:host
```

To run both the Frontend and the Backend concurrently, execute:

```bash
  npm run dev:full
```

## Building the Project

To build the project, the repository offers two build commands:

- ### Frontend Build:

```bash
  npm run build
```

This command compiles the TypeScript files and runs the Vite build process.

- ### Full Build (Frontend + Backend):

```bash
  npm run build:full
```

This command first builds the frontend, then navigates to the server folder and triggers its build using npm.

## Code Quality and Formatting

**Prettier Check**: Validate that the code adheres to Prettier formatting:

```bash
  npm run prettier:check
```

**Prettier Write**: Automatically format the code with Prettier:

```bash
  npm run prettier:write
```

## Clean Installation

If you face issues with your dependencies, you can perform a clean installation:

- ### Frontend Only:

```bash
  npm run clean-install
```

- ### Full Clean Installation (Frontend + Server):

```bash
  npm run clean-install:full
```

These commands remove the existing node_modules, lock files, and build artifacts, then reinstall all dependencies from scratch.
