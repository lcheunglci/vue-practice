# Cookbook

Vue 3 + Vuetify web app for managing recipes with SQLite storage and tag-based filtering.

## What it does
- Enter recipes (title, description, ingredients, instructions, prep/cook time, servings)
- Tag recipes with preset categories or user-created tags
- Filter recipes by tag, title, or ingredient text
- Separate routes for adding (`/recipes/new`), viewing (`/recipes/:id`), and managing tags (`/tags`)

## Tech decisions
- **Vue 3 + TypeScript**: modern component structure
- **Vuetify 4**: UI framework for forms, cards, chips, filters
- **Express + SQLite (`better-sqlite3`)**: server layer; SQLite can be swapped for Postgres by changing the DB driver (same SQL structure)
- **Separate routes**: `/api/recipes` (CRUD + tag join), `/api/tags` (list/create/delete)
- **Filter design**: tags stored in `recipe_tags` join table; recipes filtered via subquery on tag IDs or `LIKE` on ingredients/title
- **Storage**: `cookbook.db` file created by server; preset tags seeded for immediate use (Breakfast, Lunch, Dinner, Dessert, Vegan, Quick)

## Running
```
npm run dev        # Vite (frontend) + server (backend)
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Database: `server/cookbook.db`

## Next step (Postgres)
Replace `better-sqlite3` with `pg`, update connection string, keep same SQL schema.
