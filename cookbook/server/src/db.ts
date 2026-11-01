import Database from 'better-sqlite3';

const db = new Database('cookbook.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    ingredients TEXT, -- JSON array of strings
    instructions TEXT NOT NULL,
    prepTime INTEGER,
    cookTime INTEGER,
    servings INTEGER,
    createdAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS recipe_tags (
    recipeId INTEGER NOT NULL,
    tagId INTEGER NOT NULL,
    PRIMARY KEY (recipeId, tagId)
  );
`);

export default db;
