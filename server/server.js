require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const propertyRoutes = require('./routes/properties');

const app = express();

const PORT = process.env.PORT || 8010;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixflow';

// Allow requests from the Angular dev server
// (4201 is included as a fallback dev port in case 4200 is in use)
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201']
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Respond to requests at the home URL
app.get('/', (req, res) => {
  res.send('FixFlow Property & Location Management API is running!');
});

// Property & Location Management CRUD routes
app.use('/api/properties', propertyRoutes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
