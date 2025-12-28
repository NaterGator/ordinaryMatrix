# The Ordinary Matrix

Visualizes compatibility between skincare products from The Ordinary to help build safe routines.

## Features

- Interactive compatibility matrix (Compatible, Conflict, Caution)
- Conflict reasons and usage instructions
- Routine analysis summary

## Quick Start

```bash
git clone <repository-url>
cd ordinaryMatrix
npm install
npm run dev
```

## Note on Types

The upstream `the-ordinary-unofficial-api` package has incorrect type definitions. A path mapping in `tsconfig.json` fixes this locally:

```json
"paths": { "the-ordinary-unofficial-api": ["./node_modules/the-ordinary-unofficial-api/dist/src/index.d.ts"] }
```

