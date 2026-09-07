// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const problemRoutes = require('./routes/problem_routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Allows React frontend to communicate with backend
app.use(express.json());

// Routes
app.use('/api/problems', problemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});