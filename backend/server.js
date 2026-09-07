// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { startCronJob } = require('./jobs/cron_ingestion'); // Import the cron manager
const projectRoutes = require('./routes/problem_routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    // Start automated RSS batch ingestion cron schedules
    startCronJob();
  });
});