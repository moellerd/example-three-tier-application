const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /tasks — list all tasks
app.get('/tasks', async (_req, res) => {
  const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at ASC');
  res.json(rows);
});

// POST /tasks — create a task
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const { rows } = await db.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
    [title.trim()]
  );
  res.status(201).json(rows[0]);
});

// PATCH /tasks/:id — update a task (complete/uncomplete or rename)
app.patch('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { completed, title } = req.body;

  const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

  const current = rows[0];
  const newCompleted = completed !== undefined ? Boolean(completed) : current.completed;
  const newTitle = title !== undefined ? title.trim() : current.title;

  const { rows: updated } = await db.query(
    'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
    [newCompleted, newTitle, id]
  );
  res.json(updated[0]);
});

// GET /challenges — list all challenges
app.get('/challenges', async (_req, res) => {
  const { rows } = await db.query('SELECT * FROM challenges ORDER BY created_at ASC');
  res.json(rows);
});

// POST /challenges — create a challenge
app.post('/challenges', async (req, res) => {
  const { title, description, difficulty } = req.body;
  
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'description is required' });
  }
  
  const validDifficulties = ['easy', 'medium', 'hard'];
  const difficultyLevel = difficulty && validDifficulties.includes(difficulty) ? difficulty : 'medium';
  
  const { rows } = await db.query(
    'INSERT INTO challenges (title, description, difficulty) VALUES ($1, $2, $3) RETURNING *',
    [title.trim(), description.trim(), difficultyLevel]
  );
  res.status(201).json(rows[0]);
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
