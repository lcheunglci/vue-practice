# CC Reminder & Budget App

Vue 3 + Vuetify reminder and budgeting application.

## Purpose
- Credit card bill due-date reminders
- CSV banking-statement reader
- Spending pie-chart + category insights

## Stack
- Vue 3 + TypeScript + Vite
- Vuetify 3 (UI) + MDI icons
- Chart.js (pie chart setup in budget-view.vue, currently simplified to chip display)
- pinia (installed, used lightly)
- papaParse (installed for CSV parsing)

## Files
- `src/App.vue` — main layout with v-app-bar, renders ReminderView + BudgetView
- `src/main.ts` — bootstraps Vue + Vuetify + Pinia (no router)
- `src/reminder-view.vue` — upcoming/overdue reminders, add-modal with v-text-field type="date"
- `src/budget-view.vue` — CSV load, spending categories, download, table view
- `src/router/index.ts` — empty router (removed to avoid stack loop)
- `index.html` — loads MDI CSS font

## How to use
```bash
npm run dev   # dev server
npm run build # production
```

## Key fixes done this session
- Added Vuetify globally
- Imported ReminderView / BudgetView into App.vue
- Replaced broken `v-date-picker` with `v-text-field type="date"`
- Removed `v-alert` `icon` prop that caused [OBJECT OBJECT]
- Fixed router redirect loop causing "Maximum call stack size exceeded"
- Removed `usePinia` / `useRouter` imports that failed in Pinia 4 / missing routes
- Fixed syntax errors in budget-view.vue strings

## Current state
- Dev server runs cleanly on localhost:5173
- Build passes
- Reminder form works; budget view loads sample CSV data
- Home button is static (no reload handler)
