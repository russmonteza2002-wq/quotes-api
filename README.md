# Quotes API

A small Express REST API that serves quotes from an in-memory array and supports basic CRUD operations. Data resets whenever the server restarts.

## Install and run

```bash
git clone <your-repo-url>
cd quotes-api
npm install
npm start        # runs on http://localhost:3000
npm run dev      # same, but auto-restarts on file changes
```

## Endpoints

| Method | Route          | Description                          | Success | Errors   |
|--------|----------------|--------------------------------------|---------|----------|
| GET    | `/quotes`      | Get all quotes (optional `?author=`) | 200     |          |
| GET    | `/quotes/:id`  | Get one quote                        | 200     | 404      |
| POST   | `/quotes`      | Add a new quote                      | 201     | 400      |
| PUT    | `/quotes/:id`  | Update a quote                       | 200     | 400, 404 |
| DELETE | `/quotes/:id`  | Delete a quote                       | 204     | 404      |

Any unmatched route returns `404` with a JSON error.

## Example requests

**Get all quotes**
```bash
curl http://localhost:3000/quotes
```

**Filter by author**
```bash
curl "http://localhost:3000/quotes?author=Jobs"
```

**Get one quote**
```bash
curl http://localhost:3000/quotes/2
```
```json
{ "id": 2, "text": "Simplicity is the ultimate sophistication.", "author": "Leonardo da Vinci" }
```

**Create a quote**
```bash
curl -X POST http://localhost:3000/quotes \
  -H "Content-Type: application/json" \
  -d '{"text":"Premature optimization is the root of all evil.","author":"Donald Knuth"}'
```
Response `201`:
```json
{ "id": 5, "text": "Premature optimization is the root of all evil.", "author": "Donald Knuth" }
```

**Update a quote**
```bash
curl -X PUT http://localhost:3000/quotes/5 \
  -H "Content-Type: application/json" \
  -d '{"text":"Premature optimization is the root of all evil.","author":"D. Knuth"}'
```

**Delete a quote**
```bash
curl -X DELETE http://localhost:3000/quotes/1
```
Response: `204 No Content`

## Features beyond the basics

- `PUT /quotes/:id` for updates
- `?author=` query filter (case-insensitive, partial match)
- Request logger middleware
- Error-handling middleware (including malformed JSON bodies)
