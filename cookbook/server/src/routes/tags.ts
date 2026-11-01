import { Router } from 'express';
import db from '../db';

const router = Router();

// Get all tags
router.get('/', async (req, res) => {
  const tags = db.prepare('SELECT * FROM tags').all();
  res.json(tags);
});

// Create a new tag
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Tag name is required' });
  }

  const result = db.prepare('INSERT INTO tags (name) VALUES (?)').run(name);
  const tag = db.prepare('SELECT * FROM tags WHERE name = ?').get(name);
  res.status(201).json(tag);
});

// Delete a tag
router.delete('/:id', async (req, res) => {
  const result = db.prepare('DELETE FROM tags WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Tag not found' });
  }
  res.json({ success: true });
});

export default router;
