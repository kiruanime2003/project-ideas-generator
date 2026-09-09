// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { startCronJob } = require('./jobs/cron_ingestion');



// 1. Import the problem routes file
const problemRoutes = require('./routes/problem_routes'); // Verify path to problemRoutes.js

const app = express();

// backend/server.js
const { runBatchIngestion } = require('./jobs/cronIngestion');

// External cron trigger endpoint
app.get('/api/cron/trigger', async (req, res) => {
  // Simple secret key protection so random users can't trigger it
  const secret = req.query.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const mode = req.query.mode; // 'morning' or 'evening'
  const isMorning = mode === 'morning';

  // Trigger ingestion asynchronously
  runBatchIngestion(isMorning);

  return res.status(200).json({
    success: true,
    message: `Triggered ${isMorning ? 'MORNING' : 'EVENING'} batch ingestion.`
  });
});

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