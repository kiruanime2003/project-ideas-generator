// backend/routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const ProblemIdea = require('../models/problem_idea');

// @route   GET /api/problems
// @desc    Get paginated project ideas with optional domain filter
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const domain = req.query.domain;

    // Filter query
    const query = {};
    if (domain && domain.toLowerCase() !== 'all') {
      query.domain = { $regex: new RegExp(`^${domain}$`, 'i') }; // Case-insensitive regex match
    }

    const total = await ProblemIdea.countDocuments(query);
    const problems = await ProblemIdea.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: problems,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;