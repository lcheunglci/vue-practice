import Database from 'better-sqlite3';
const db = new Database('cookbook.db');
db.exec(`INSERT OR IGNORE INTO tags (name) VALUES ('Breakfast'),('Lunch'),('Dinner'),('Dessert'),('Vegan'),('Quick');`);
console.log('preset tags seeded');