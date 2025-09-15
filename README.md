# Saleor GraphiQL

This repository builds the GraphiQL interface used in the [Saleor playground](https://github.com/saleor/saleor/blob/main/templates/graphql/playground.html#L23) via CDN.

## Prerequisites

### PNPM and Corepack

Due to [outdated signatures in Corepack](https://github.com/nodejs/corepack/issues/612), update Corepack to the latest version first:

```shell
npm install --global corepack@latest
```

Then enable pnpm with the correct version:

```shell
corepack enable pnpm
```

## Development

### Running the Application

1. Install dependencies:

```shell
pnpm install
```

2. Start the development server:

```shell
pnpm dev
```

3. In a separate terminal window, start the HTTP server to see changes live:

```shell
pnpm serve
```

### Editor Setup

For the best development experience with VS Code, use these recommended settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.run": "onSave",
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
  "css.lint.unknownAtRules": "ignore"
}
```

Create a `.vscode/settings.json` file in your local workspace with these settings.

## Building and Releasing

### Building for Production

To create a production build:

```shell
pnpm build
```

### Publishing a Release

The project uses automated release management. To publish a new version:

```shell
pnpm release
```

**Note**: The `prepublishOnly` script automatically runs the build process before publishing, ensuring the latest code is included in the release.

### Distribution

The built package is distributed via:

- **npm**: Published as `@saleor/graphql-playground`
- **CDN**: Used in the Saleor playground via unpkg
- **Multiple formats**: Available as CJS, ESM, and UMD modules
