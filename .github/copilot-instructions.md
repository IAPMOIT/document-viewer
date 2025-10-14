# Document Viewer - Copilot Instructions

## Repository Overview

This is a monorepo for document viewer components that support multiple file types through various rendering strategies. The project provides document viewing capabilities for both Angular (`ngx-doc-viewer`) and React (`react-documents`) frameworks, along with a shared helper library (`docviewhelper`).

**Repository Type**: Nx monorepo  
**Languages**: TypeScript, JavaScript, HTML, SCSS  
**Frameworks**: Angular 16, React 18  
**Build Tool**: Nx 17.0.3  
**Package Manager**: npm  
**Runtime**: Node.js 20.19.5, npm 10.8.2  
**Repository Size**: ~4 packages, 2 demo apps, 1 shared library

## High-Level Architecture

The repository contains document viewer libraries that support multiple file types:
- **PDF files**: Direct embed or PDF.js integration
- **Word documents (.docx)**: Mammoth.js conversion to HTML
- **Office files**: Microsoft Office Online viewer integration
- **Various formats**: Google Docs viewer integration

### File Structure

```
/
├── packages/               # Published npm packages
│   ├── ngx-doc-viewer/     # Angular component library
│   ├── react-documents/    # React component library
│   └── docviewhelper/      # Shared helper library
├── apps/                   # Demo applications
│   ├── demo-angular/       # Angular demo app
│   └── demo-react/         # React demo app
├── libs/                   # Internal libraries
│   └── data/               # Data utilities
└── tools/                  # Build tooling
```

### Key Configuration Files

- `nx.json`: Nx workspace configuration
- `tsconfig.base.json`: TypeScript base configuration with path mappings
- `package.json`: Root dependencies and npm scripts
- `jest.config.ts`: Jest test configuration
- `.eslintrc.json`: ESLint configuration
- `firebase.json`: Firebase hosting configuration for demos

## Build & Development Instructions

### Prerequisites

**IMPORTANT**: Always run `npm install --legacy-peer-deps` due to Angular/Jest version conflicts. Regular `npm install` will fail with peer dependency conflicts.

```bash
# Required due to Jest version conflicts between Angular 16 and Nx 17
npm install --legacy-peer-deps
```

### Environment Setup

1. **Install Dependencies**: Always use `--legacy-peer-deps` flag
2. **Node.js Version**: 20.19.5 or compatible
3. **Cypress**: May fail to install due to network restrictions - use `CYPRESS_INSTALL_BINARY=0` if needed

### Build Commands

#### Individual Package Builds

```bash
# Build shared helper library (this works)
npx nx build docviewhelper

# NOTE: The following builds currently FAIL due to TypeScript path mapping issues
# npx nx build ngx-doc-viewer  # FAILS - Cannot find module 'docviewhelper'
# npx nx build react-documents # FAILS - Cannot find module 'docviewhelper'
```

**IMPORTANT**: The library packages currently cannot be built individually due to TypeScript path resolution issues where the compiler cannot find the `docviewhelper` module even after it's built. This is a known limitation of the current monorepo setup.

#### Demo Application Builds

```bash
# Build Angular demo (development mode works, production may fail)
npx nx build demo-angular --configuration=development

# Build React demo (production build works)
npx nx build demo-react
```

## Development Workflow

Since individual library packages cannot be built, development should focus on:

1. **Demo Applications**: These work and can be used to test changes
2. **Helper Library**: Can be built and tested independently
3. **Source Code Changes**: Make changes directly in package source code
4. **Testing via Demos**: Use the demo apps to validate functionality

### Working Commands

```bash
# These commands work reliably:
npm install --legacy-peer-deps
npx nx build docviewhelper
npx nx build demo-angular --configuration=development
npx nx build demo-react
npx nx serve demo-angular --port=4200
npx nx serve demo-react --port=4201
npx nx lint ngx-doc-viewer
npx nx lint react-documents
npx nx lint docviewhelper
```

### Development Servers

```bash
# Serve Angular demo on port 4200
npx nx serve demo-angular --port=4200

# Serve React demo on port 4201
npx nx serve demo-react --port=4201
```

### Testing

```bash
# Run tests (most packages have no tests currently)
npx nx test ngx-doc-viewer
npx nx test react-documents
npx nx test docviewhelper
```

### Linting

```bash
# Lint individual packages
npx nx lint ngx-doc-viewer
npx nx lint react-documents
npx nx lint docviewhelper

# Note: react-documents has some ESLint warnings that are not errors
```

## Known Build Issues & Workarounds

### 1. Dependency Installation
**Issue**: Regular `npm install` fails with peer dependency conflicts  
**Workaround**: Always use `npm install --legacy-peer-deps`

### 2. Cypress Installation
**Issue**: Cypress binary download may fail in restricted environments  
**Workaround**: Use `CYPRESS_INSTALL_BINARY=0 npm install --legacy-peer-deps`

### 3. Angular Production Build
**Issue**: `demo-angular` production build fails with "document.documentElement.setAttribute is not a function"  
**Workaround**: Use development configuration: `npx nx build demo-angular --configuration=development`

### 4. Library Package Build Failures
**Issue**: `ngx-doc-viewer` and `react-documents` builds fail with "Cannot find module 'docviewhelper'"  
**Root Cause**: TypeScript path mapping issues in the monorepo setup  
**Current Status**: No working solution - library packages cannot be built individually  
**Workaround**: Use demo applications for development and testing

### 5. TypeScript Path Mapping
**Issue**: Package builds may fail if dependencies aren't built in correct order  
**Workaround**: Always build `docviewhelper` first, then other packages (Note: This doesn't currently work)

### 5. Test Files in Build
**Issue**: Fixed - Test files were being included in library builds  
**Solution**: Updated `tsconfig.lib.json` files to exclude `**/*.test.ts` files

## Package Dependencies

- `docviewhelper`: Core shared library - build this first
- `ngx-doc-viewer`: Depends on `docviewhelper`
- `react-documents`: Depends on `docviewhelper`
- Demo apps: Use the respective libraries

## Firebase Deployment

Firebase hosting is configured for both demo applications:
- Angular demo: Uses `demo-angular` target
- React demo: Uses `demo-react` target
- Predeploy hooks build the applications automatically

```bash
# Deploy commands from package.json
npm run deploy:demo:angular
npm run deploy:demo:react
```

## Key Source Files

### Main Components

- **`packages/ngx-doc-viewer/src/lib/document-viewer.component.ts`**: Angular component for document viewing
- **`packages/react-documents/src/lib/react-documents.tsx`**: React component for document viewing  
- **`packages/docviewhelper/src/lib/helper.ts`**: Shared utility functions for document processing

### Component Architecture

Both Angular and React components provide similar APIs:
- Support for multiple viewer types: `google`, `office`, `mammoth`, `pdf`, `url`
- Document URL input with configurable viewer selection
- Google Docs viewer integration with loading state checking
- Mammoth.js integration for .docx files
- Office Online viewer integration

### Key Functions in docviewhelper

- `getViewerDetails()`: Constructs viewer URLs for different services
- `getDocxToHtml()`: Converts .docx files to HTML using Mammoth.js
- `googleCheckSubscription()`: Monitors iframe loading for Google viewer
- `iframeIsLoaded()`: Checks if iframe content has loaded
- `fileToArray()`: Converts files to ArrayBuffer for processing

## External Dependencies

### Runtime Dependencies
- **Mammoth.js**: Required for .docx file support - must be loaded in HTML
- **Bootstrap**: Used in demo applications for styling
- **Google Docs Viewer**: External service for various file types
- **Microsoft Office Online**: External service for Office files

### Development Notes
- No unit tests currently exist in packages (all tests pass with "No tests found")
- ESLint warnings exist in react-documents but are not blocking
- Browserslist warnings about outdated database are informational only

## Validation Pipeline

No formal CI/CD pipeline exists currently. Manual validation steps:

1. Run `npm install --legacy-peer-deps`
2. Build `docviewhelper` package: `npx nx build docviewhelper` (this works)
3. Build demo applications in development mode (these work)
4. Run linting on all packages (these work)
5. Test serve commands for demo applications (these work)

**Note**: Individual library package builds (`ngx-doc-viewer`, `react-documents`) currently fail and cannot be validated manually.

## Trust These Instructions

These instructions are comprehensive and tested. Only perform additional searches if:
- You encounter errors not documented here
- You need to modify build configurations
- You're working with files not covered in this guide

The build system is complex due to the monorepo structure and framework integration, but following these exact steps will ensure successful builds and development.