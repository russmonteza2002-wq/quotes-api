import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Stretch: simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

let quotes = [
  { id: 1, text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { id: 2, text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { id: 3, text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { id: 4, text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' }
];

// Use max id + 1 so ids are never reused after a delete
const nextId = () => (quotes.length ? Math.max(...quotes.map((q) => q.id)) + 1 : 1);

// GET all (stretch: ?author=Jobs filter, case-insensitive partial match)
app.get('/quotes', (req, res) => {
  const { author } = req.query;
  if (author) {
    const result = quotes.filter((q) =>
      q.author.toLowerCase().includes(author.toLowerCase())
    );
    return res.json(result);
  }
  res.json(quotes);
});

// GET one
app.get('/quotes/:id', (req, res) => {
  const id = Number(req.params.id);
  const quote = quotes.find((q) => q.id === id);
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }
  res.json(quote);
});

// POST create
app.post('/quotes', (req, res) => {
  const { text, author } = req.body ?? {};
  if (!text || !author) {
    return res.status(400).json({ error: 'Both "text" and "author" are required' });
  }
  const newQuote = { id: nextId(), text, author };
  quotes.push(newQuote);
  res.status(201).json(newQuote);
});

// Stretch: PUT update
app.put('/quotes/:id', (req, res) => {
  const id = Number(req.params.id);
  const quote = quotes.find((q) => q.id === id);
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }
  const { text, author } = req.body ?? {};
  if (!text || !author) {
    return res.status(400).json({ error: 'Both "text" and "author" are required' });
  }
  quote.text = text;
  quote.author = author;
  res.json(quote);
});

// DELETE
app.delete('/quotes/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = quotes.findIndex((q) => q.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Quote not found' });
  }
  quotes.splice(index, 1);
  res.status(204).send();
});

// 404 fallback for any unmatched route
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// Stretch: error handler (also handles malformed JSON bodies)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
