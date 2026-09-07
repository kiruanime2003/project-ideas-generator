// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { startCronJob } = require('./jobs/cron_ingestion');

// 1. Import the problem routes file
const problemRoutes = require('./routes/problem_routes'); // Verify path to problemRoutes.js

const app = express();

app.use(cors());
app.use(express.json());

// 2. Mount the routes at /api/problems 👈 CRITICAL STEP
app.use('/api/problems', problemRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startCronJob();
  });
});