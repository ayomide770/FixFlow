require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 8001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is required. Add your personal Atlas connection string to server/.env.');
  process.exit(1);
}

// Allow requests from the Angular dev server
app.use(cors({ origin: 'http://localhost:4200' }));

// Parse incoming JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Respond to requests at the home URL
app.get('/', (req, res) => {
  res.send('FixFlow API is running!');
});

// Auto-load every route module in routes/. Each file exports
// { path, router } and is mounted automatically — new components add a
// new file here without editing this file, so teammates working on
// separate components never collide on the same line of server.js.
const routesDir = path.join(__dirname, 'routes');

fs.readdirSync(routesDir)
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    const route = require(path.join(routesDir, file));
    app.use(route.path, route.router);
    console.log(`Mounted routes: ${route.path}`);
  });

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
