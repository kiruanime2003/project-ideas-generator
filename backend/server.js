// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { startCronJob } = require('./jobs/cron_ingestion');

const { runBatchIngestion } = require('./jobs/cron_ingestion'); // Adjust path if needed

// Temporary test route to run batch ingestion manually
app.get('/api/test-cron', async (req, res) => {
  try {
    // Run the batch ingestion (passing true triggers the morning wipe & fetch cycle)
    runBatchIngestion(true);
    res.json({ success: true, message: "Manual batch ingestion started in background!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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