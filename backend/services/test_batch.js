// backend/services/test_batch.js
require('dotenv').config();
const connectDB = require('../config/db');
// Verify path steps up to jobs/cronIngestion
const { runBatchIngestion } = require('../jobs/cronIngestion');

async function runTest() {
  try {
    await connectDB();
    console.log('🚀 Running test batch execution...');
    await runBatchIngestion(true); // true = morning reset run
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    process.exit(0);
  }
}

runTest();