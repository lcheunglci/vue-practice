# Project Plan — Vue/Electron CSV Viewer Conversion

## Project: vue-electron-csv-viewer
Previous: Angular `report-csv-electron` at `P:\repo\lcheunglci\angular-practice\report-csv-electron`

---

## 1. Objective
Convert the Angular `report-csv-electron` application to a Vue 3 + Vite + Electron desktop application using ESM (`"type": "module"`). Replicate all core functionality: CSV import, SQLite persistence, report CRUD, inline row editing, CSV copy, JSON/XLSX/ODS export.

---

## 2. Architecture

### Stack
- Vue 3 (Composition API + `<script setup lang="ts">`)
- Vite (dev server + production build)
- TypeScript (strict mode)
- Electron 41.7.1 (ESM main/preload, `.cjs` preload for native modules compatibility)
- Vue Router (`createWebHashHistory` for file-protocol compatibility)
- Bootstrap 5.3 (CSS only, no JS components; custom modals via templates)
- `better-sqlite3` (local SQLite DB in `userData`)
- `papaparse` (CSV parsing)
- `xlsx` (spreadsheet export)

### ESM Strategy
- `package.json`: `"type": "module"` + `"main": "main.cjs"`
- Main process (`main.cjs`): CommonJS requires (Electron CJS loader handles `require('electron')`; named ESM imports verified working)
- Preload (`preload.cjs`): CommonJS (`require('electron')`) — ESM preload `.mjs` not needed for this project since preload only exposes `contextBridge`
- Renderer (`src/`): Full ESM TypeScript

---

## 3. Completed Work

### 3.1 Electron Shell (`main.cjs`, `preload.cjs`, `menu.cjs`, `db.cjs`)
Copied and adapted from Angular project:
- `main.cjs`: BrowserWindow creation, `DEV_URL` / production `loadFile`, IPC handlers (`report:*`), `Menu.setApplicationMenu()`
- `preload.cjs`: `contextBridge` exposing `window.reportApi`
- `menu.cjs`: File, Edit, View, Help menus with `About`, `Quit`
- `db.cjs`: SQLite schema (`reports`, `report_rows`), `parseCsv`, CRUD, `exportRowsToJson`, `exportRowsToSpreadsheet`

### 3.2 Type Definitions (`env.d.ts`, `src/electron.d.ts`)
- `ReportSummary`, `ReportDetail`, `ReportRow`, `ReportRowUpdate`, `ExportFormat`
- `ElectronReportApi` interface
- `Window` global augmentation (`window.reportApi`)

### 3.3 Service Layer (`src/services/reportService.ts`)
- Centralized `ReportService` class wrapping all `window.reportApi` calls
- `exportReport`, `importReport`, `listReports`, `getReport`, etc.
- `requireApi()` guard throws if not running in Electron

### 3.4 Vue Components

| Component | File | Features |
|-----------|------|----------|
| Main Shell | `App.vue` | Sidebar nav (`RouterLink`), `RouterView` outlet, Bootstrap dark sidebar |
| Reports List | `ReportsList.vue` | Load reports table, Add/Remove buttons, `AddReportModal` + `ConfirmClearAllModal` integration |
| Report Detail | `ReportDetail.vue` | Editable rows (date, orderId, description, cost), sort controls, rename input, delete, back button, total cost footer |
| Export View | `ExportView.vue` | Report dropdown, format radio buttons (JSON/XLSX/ODS), export with save dialog, info/error alerts |
| Add Modal | `components/AddReportModal.vue` | CSV file picker via `openCsvDialog`, name input, import button |
| Clear Modal | `components/ConfirmClearAllModal.vue` | Warning alert, irreversible checkbox, delete all |

### 3.5 Routing (`src/router/index.ts`)
- `/` → redirect to `/reports`
- `/reports` → `ReportsList`
- `/reports/:id` → `ReportDetail` (params passed via props)
- `/export` → `ExportView`

### 3.6 Build & Scripts (`package.json`)
- `dev`: `vite`
- `build`: `run-p type-check "build-only {@}" --`
- `electron:dev`: `concurrently` (vite + electron via `wait-on`)
- `electron:start`: `npm run build && electron .`
- `electron:pack` / `electron:build`: `electron-builder` (release output `release/`)
- `postinstall`: `electron-rebuild -f -w better-sqlite3`

---

## 4. Build Verification

- `npm install` completed (Electron binary installed)
- `npm run build` → `✓ built in 456ms` (after fixing TypeScript errors)
- `dist/index.html` + `dist/assets/*` generated (Bootstrap CSS bundled, Vue router bundle ~107KB)

---

## 5. TypeScript Fixes Applied
- `ReportDetail.vue`: `sortColumn` null-check for `aria-sort`; `drafts[row.id]!.date` non-null assertions for `v-model`
- `ExportView.vue`: `reports.value[0]` guarded with `&& reports.value[0]` check

---

## 6. What Was Not Done (Optional / Future)
- Unit tests (`src/__tests__`) only contain basic mount test (updated to `ReportsList`); comprehensive coverage not added
- End-to-end tests not implemented
- No state management library (Pinia/Vuex); component-level `ref` state sufficient for single-window desktop app
- `better-sqlite3` rebuild (`postinstall`) needed for native binary compatibility; included in scripts

---

## 7. Usage Commands

```bash
# Development (Vite + Electron)
npm run electron:dev

# Build production + run Electron
npm run electron:start

# Package (dir output)
npm run electron:pack

# Build installer
npm run electron:build
```

---

## 8. Key Decisions
1. **CJS preload/main** (`main.cjs`/`preload.cjs`) instead of ESM (`.mjs`): avoids Electron's `.mjs` preload restrictions; simpler build process with Vite ESM renderer + CJS Electron shell.
2. **Bootstrap CSS import** in `src/main.ts`: allows Vite to bundle CSS into `dist/assets/`.
3. **`createWebHashHistory`**: file-based Electron apps work correctly with hash routing (no server needed for nested routes).
4. **No Vite plugin for Electron** (e.g. `electron-vite`): kept close to original Angular setup (separate Vite + Electron binaries) for simplicity.
