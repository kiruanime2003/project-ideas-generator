// backend/services/testBatch.js
require('dotenv').config();
const connectDB = require('../config/db');
const { runBatchIngestion } = require('../jobs/cron_ingestion');

async function test() {
  await connectDB();
  
  // Pass 'true' to simulate Morning Run (wipe & generate 11), or 'false' for Evening Run
  await runBatchIngestion(true); 
  
  process.exit(0);
}

test();