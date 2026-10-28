const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /challenges — list all challenges
app.get('/challenges', async (_req, res) => {
  const { rows } = await db.query('SELECT * FROM challenges ORDER BY created_at ASC');
  res.json(rows);
});

// POST /challenges — create a challenge
app.post('/challenges', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const { rows } = await db.query(
    'INSERT INTO challenges (title) VALUES ($1) RETURNING *',
    [title.trim()]
  );
  res.status(201).json(rows[0]);
});

// PATCH /challenges/:id — update a challenge (complete/uncomplete or rename)
app.patch('/challenges/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { completed, title } = req.body;

  const { rows } = await db.query('SELECT * FROM challenges WHERE id = $1', [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

  const current = rows[0];
  const newCompleted = completed !== undefined ? Boolean(completed) : current.completed;
  const newTitle = title !== undefined ? title.trim() : current.title;

  const { rows: updated } = await db.query(
    'UPDATE challenges SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
    [newCompleted, newTitle, id]
  );
  res.json(updated[0]);
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
