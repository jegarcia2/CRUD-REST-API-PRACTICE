# Expense Tracker API

REST API for submitting and reviewing team expenses.

## Setup
    npm install
    npm start        # serves on http://localhost:3000
    npm test         # runs the test suite

## Storage
SQLite via `better-sqlite3` — a single-file DB that persists across restarts
with zero external server to run. Appropriate for a service of this size; I'd
move to Postgres if it needed concurrent writers or horizontal scaling.

## Endpoints
| Method | Path                  | Purpose                              |
|--------|-----------------------|--------------------------------------|
| POST   | /expenses             | Create (starts `pending`)            |
| GET    | /expenses             | List; `?status=` and `?category=`    |
| GET    | /expenses/:id         | Fetch one                            |
| PATCH  | /expenses/:id         | Edit (pending only)                  |
| POST   | /expenses/:id/status  | Approve/reject (pending only)        |
| DELETE | /expenses/:id         | Delete                               |
| GET    | /summary              | Totals grouped by category (bonus)   |

## Design decisions / tradeoffs
- **Constraints in the DB schema**, not only in JS — bad data can't persist even
  if validation has a bug.
- **Status changes get a dedicated endpoint** rather than free editing of the
  `status` field, so transition rules live in one place.
- **Editing a non-pending expense returns 409**, not 400: the input is valid;
  the resource's *state* forbids the change.
- **Unknown filter values return 400** rather than being silently ignored, so a
  client's typo surfaces instead of returning misleading results.

## What I'd do next with more time
- Auth (who is a "manager"?) — currently anyone can approve.
- Pagination on the list endpoint.
- Cursor-based listing if data grew large.