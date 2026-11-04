import { Router } from 'express';
import db from '../db';

const router = Router();

// Get all recipes with optional filtering
router.get('/', async (req, res) => {
  const { tagIds = [], ingredient = null, search = null } = req.query;
  let query = 'SELECT * FROM recipes WHERE 1=1';
  const params = [];

  if (tagIds && tagIds.length > 0) {
    const ids = Array.isArray(tagIds) ? tagIds : [tagIds];
    query += ' AND id IN (SELECT recipeId FROM recipe_tags WHERE tagId IN (' + ids.join(',') + '))';
    params.push(...ids);
  }
  if (ingredient) {
    query += ' AND ingredients LIKE ?';
    params.push(`%${ingredient}%`);
  }
  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const recipes = db.prepare(query).all(...params);

  // Attach tags to each recipe
  const stmt = db.prepare('SELECT tagId FROM recipe_tags WHERE recipeId = ?');
  for (const recipe of recipes) {
    const tagRows = stmt.all(recipe.id);
    recipe.tags = tagRows.map(r => r.tagId);
    try {
      recipe.ingredients = JSON.parse(recipe.ingredients || '[]');
    } catch {
      recipe.ingredients = (recipe.ingredients || '').split(/\n|,/).filter((s: string) => s.trim() !== '');
    }
  }

  res.json(recipes);
});

// Get a single recipe
router.get('/:id', async (req, res) => {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  const tagRows = db.prepare('SELECT tagId FROM recipe_tags WHERE recipeId = ?').all(recipe.id);
  recipe.tags = tagRows.map(r => r.tagId);
  try {
    recipe.ingredients = JSON.parse(recipe.ingredients || '[]');
  } catch {
    recipe.ingredients = (recipe.ingredients || '').split(/\n|,/).filter((s: string) => s.trim() !== '');
  }
  res.json(recipe);
});

// Create a new recipe
router.post('/', async (req, res) => {
  const { title, description, ingredients, instructions, prepTime, cookTime, servings, tags = [] } = req.body;
  if (!title || !instructions) {
    return res.status(400).json({ error: 'Title and instructions are required' });
  }

  let ingredientsArray: string[] = [];
  if (typeof ingredients === 'string') {
    ingredientsArray = ingredients.split(/\n|,/).map(s => s.trim()).filter(s => s !== '');
  } else if (Array.isArray(ingredients)) {
    ingredientsArray = ingredients;
  }
  const ingredientsJson = JSON.stringify(ingredientsArray);
  const result = db.prepare(
    'INSERT INTO recipes (title, description, ingredients, instructions, prepTime, cookTime, servings, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description, ingredientsJson, instructions, prepTime || null, cookTime || null, servings || null, Date.now());

  const recipeId = result.lastInsertRowid;

  // Insert tags
  for (const tagId of tags) {
    db.prepare('INSERT OR IGNORE INTO recipe_tags (recipeId, tagId) VALUES (?, ?)').run(recipeId, tagId);
  }

  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId);
  const tagRows = db.prepare('SELECT tagId FROM recipe_tags WHERE recipeId = ?').all(recipeId);
  recipe.tags = tagRows.map(r => r.tagId);
  recipe.ingredients = JSON.parse(recipe.ingredients || '[]');
  res.status(201).json(recipe);
});

// Update a recipe
router.put('/:id', async (req, res) => {
  let { title, description, ingredients, instructions, prepTime, cookTime, servings, tags = [] } = req.body;
  // Handle ingredients as either array or newline-separated string
  if (typeof ingredients === 'string') {
    ingredients = ingredients.split(/\n|,/).map(s => s.trim()).filter(s => s !== '');
  } else if (!Array.isArray(ingredients)) {
    ingredients = [];
  }
  const ingredientsJson = JSON.stringify(ingredients || []);
  const query = 'UPDATE recipes SET title = ?, description = ?, ingredients = ?, instructions = ?, prepTime = ?, cookTime = ?, servings = ? WHERE id = ?';
  const params = [title, description, ingredientsJson, instructions, prepTime || null, cookTime || null, servings || null, req.params.id];
  const result = db.prepare(query).run(...params);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  // Update tags
  db.prepare('DELETE FROM recipe_tags WHERE recipeId = ?').run(req.params.id);
  for (const tagId of tags) {
    db.prepare('INSERT OR IGNORE INTO recipe_tags (recipeId, tagId) VALUES (?, ?)').run(req.params.id, tagId);
  }

  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);
  const tagRows = db.prepare('SELECT tagId FROM recipe_tags WHERE recipeId = ?').all(recipe.id);
  recipe.tags = tagRows.map(r => r.tagId);
  recipe.ingredients = JSON.parse(recipe.ingredients || '[]');
  res.json(recipe);
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
  const result = db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json({ success: true });
});

export default router;