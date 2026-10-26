## Project Plan — Vue/Electron CSV Viewer

## 1. Objective
Convert the Angular `report-csv-electron` application to a Vue 3 + Vite + Electron desktop application using ESM (`"type": "module"`). Replicate all core functionality: CSV import, SQLite persistence, report CRUD, inline row editing, CSV copy, JSON/XLSX/ODS export.

## 2. Architecture
- **Stack**: Vue 3 (Composition API), Vite, TypeScript, Electron 41.7.1, Vuetify 3, `better-sqlite3`, `papaparse`, `xlsx`, Vue Router, Electron ESM with CJS preload.
- **ESM Strategy**: Main process (`main.cjs`) uses Node.js ESM loader; preload (`preload.cjs`) uses CommonJS to expose Electron APIs to Vue ESM renderer.

## 3. Completed Work

### 3.1 Electron Shell
- `main.cjs`: BrowserWindow creation, IPC handlers (`report:*`), `Menu.setApplicationMenu()` with File submenu containing *Toggle Dark Mode*.
- `preload.cjs`: `contextBridge` exposes `window.reportApi` with `onToggleTheme` listener.
- `db.cjs`: SQLite schema (`reports`, `report_rows`), parsing, CRUD, export functions.

### 3.2 Type Definitions
- `env.d.ts`: Added `/// <reference types="vite/client" />` and `/// <reference path="src/electron.d.ts" />`
- `src/electron.d.ts`: Defined `ElectronReportApi` with `onToggleTheme(callback: (payload: { source: string }) => void)`

### 3.3 Service Layer
- `src/services/reportService.ts`: Centralized report operations via `window.reportApi` with `requireApi()` guard.

### 3.4 Vue Components
- **ReportsList.vue**: List reports, Add/Delete buttons, toggle modal for clear all
- `ReportDetail.vue`: View report with inline editing, sorting, and export
- `ExportView.vue`: Report selection + export format selector
- `AddReportDialog.vue`: Dialog for CSV file pick + name, imports CSV via `reportApi.openCsvDialog`
- `ConfirmClearDialog.vue`: Confirmation dialog with irreversible checkbox

### 3.5 Routing
- `src/router/index.ts`: Routes for `/`, `/reports`, `/reports/:id`, `/export`

### 3.5 Build & Scripts
- `npm run dev`: Vite dev server
- `npm run build`: Production build (Vite)
- `npm run electron:dev`: Concurrent Vite + Electron dev (wait-on, nodemon)
- `npm run electron:start`: Build + electron launch
- `electron:pack` / `electron:build`: Use `electron-builder` for release artifacts

### 3.6 Build Verification
- `npm run build` → `dist/` directory with production assets (index.html + assets)

### 3.5 Fixes Applied
- Fixed TypeScript errors in `ReportDetail.vue` (undefined object properties, sorting column types)
- Fixed `ExportView.vue` loading state check
- Added TypeScript type safety for preload and app APIs

### 4. Project Plan
Included in `project-plans.md`

### 5. What Was Not Done
- Unit/E2E tests (only basic mount test added)
- No state management library (Pinina/Vuex), component-level state sufficient
- No custom Electron IPC for theme toggle — uses existing IPC for report data

### 4.1 Key Files

| File | Purpose |
|------|---------|
| `main.cjs` | Electron main process, IPC handlers, menu setup |
| `preload.cjs` | Bridge between main and renderer via `contextBridge` |
| `menu.cjs` | Application menu with File → Toggle Dark Mode |
| `db.cjs` | SQLite database and CRUD API |
| `src/services/reportService.ts` | Unified API to Electron IPC handlers |
| `src/electron.d.ts` | Type definitions for Electron API |
| `src/App.vue` | Main layout with Vue Router and theme toggle listener |
| `src/views/*.vue` | All UI pages and modals |
| `src/router/index.ts` | Vue Router configuration |

### 4.4 Build & Deployment
- **Development**: `npm run electron:dev` (vite + electron)
- **Production**: `npm run electron:build` (build + electron-builder)
- **Packaging**: `electron-builder` creates platform-specific installers (NSIS, DMG, AppImage)

## 5. Future Improvements

- Add unit/integration tests
- Implement state management (Pinia) for larger apps
- Add authentication (optional)
- Support dark mode toggle via menu item (current implementation)

## 8. Usage Commands

```bash
# Development
npm run electron:dev

# Production build
npm run electron:build

# Packaging
npm run electron:pack

# Build installer
npm run electron:build
```

---

## 8. Key Decisions

1. **ESM in Main Process**: Used `"type": "module"` in `package.json` with `main.cjs` for Electron compatibility.
2. **CJS Preload**: Electron preload scripts must be CommonJS, so we use `.cjs` files and `require()` for Electron APIs.
3. **Vue Router**: Uses `createWebHashHistory` to avoid server requirements for nested routes.
4. **Bootstrap → Vuetify**: Switched from Bootstrap CSS to Vuetify 3 for consistent UI components and dark mode support.

## 9. Limitations
- Preload scripts must have `.mjs` extension for ESM in preload (not used here since we use CJS preload)
- ESM preload scripts must have context isolation to use dynamic Node.js imports
- Electron 28+ required for ESM support (we're on 41.7.1)

## 9.1 Known Limitations
- Preload scripts must be unsandboxed to use `window.reportApi` (already handled)
- ESM preload scripts must have `.mjs` extension (we use CJS preload, which is acceptable)
- Electron's `main` process uses CJS for compatibility; named ESM imports work via Electron's patched loader

## 9.2 Next Steps
1. Verify Electron menu item works: `npm run electron:dev` → open app → File → Toggle Dark Mode → toggle theme
2. Verify Vue UI updates immediately after menu click
3. Test dark mode toggle across all views

Let me know if you need further adjustments!
