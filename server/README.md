# FixFlow Backend

Express + MongoDB (Mongoose) API shared by all three FixFlow components.

## Adding a new component's routes

`server.js` auto-loads every file in `routes/` — you never need to edit `server.js` itself. This means teammates working on different components never touch the same line of the same file, so merging each person's branch into `main` won't cause conflicts here.

To add a component:

1. Create a Mongoose model in `models/` (see `models/property.js` for the pattern).
2. Create a route file in `routes/` that exports `{ path, router }`:

   ```js
   const express = require('express');
   const router = express.Router();

   // ...GET / POST / PUT / DELETE handlers...

   module.exports = { path: '/api/your-resource', router };
   ```

3. That's it — `server.js` picks it up automatically on the next restart (or immediately with `npm run dev`, which uses Nodemon).

## Running locally

```bash
npm install
npm start      # node server.js
npm run dev    # nodemon server.js (auto-restarts on file changes)
```

Requires a local MongoDB instance running on the default port (`27017`). Copy `.env.example` to `.env` to override the port or connection string — `.env` is gitignored, never commit real credentials.
