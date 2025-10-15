# IAPMO Document Viewer Package

This repository provides the IAPMO-specific version of the document viewer package that can be published to GitHub Package Registry.

## Available Package

- `@iapmoit/document-viewer` - Angular component for document viewing
- `@iapmoit/docviewhelper` - Shared helper library

## GitHub Actions Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/publish-npm.yml`) that automatically:

1. Builds and tests the packages
2. Publishes packages to GitHub Package Registry 
3. Triggers on pushes to main/master branches or manual workflow dispatch
4. Also triggers on GitHub releases for versioned publishing

## Manual Publishing

To manually publish packages:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Publish all IAPMO packages
npm run publish:iapmo:docviewhelper
npm run publish:iapmo:ngx-doc-viewer  
```

## Package Installation

Users can install the packages from GitHub Package Registry:

```bash
# Configure npm to use GitHub Package Registry for @iapmoit scope
echo "@iapmoit:registry=https://npm.pkg.github.com" >> .npmrc

# Install the Angular package
npm install @iapmoit/document-viewer

# Install the helper library
npm install @iapmoit/docviewhelper
```

## Authentication

To use packages from GitHub Package Registry, users need to authenticate:

1. Create a GitHub Personal Access Token with `read:packages` permission
2. Add to `.npmrc`: `//npm.pkg.github.com/:_authToken=YOUR_TOKEN`

## GitHub Actions Setup

The workflow uses the following organization-level secrets which are already configured:
- `IAPMO_DEPLOY_TOKEN` - GitHub Personal Access Token with packages:write permission
- `IAPMO_DEPLOY_USER` - GitHub username for authentication

No additional setup is needed as these secrets are available at the organization level.

## Known Limitations

Due to TypeScript path mapping issues in the monorepo setup:
- The Angular package (`@iapmoit/document-viewer`) is published from source files
- Only the helper library (`@iapmoit/docviewhelper`) is built and published as a compiled package

This approach works for publishing but consumers may need to handle TypeScript compilation in their own projects.