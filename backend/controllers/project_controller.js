// backend/controllers/projectController.js
const ProblemIdea = require('../models/ProblemIdea');

exports.getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; // 6 cards per page looks great on grid layouts
    const domain = req.query.domain;

    const skip = (page - 1) * limit;

    // Filter query
    const query = domain && domain !== 'all' ? { domain } : {};

    // Get paginated results and total count in parallel
    const [projects, total] = await Promise.all([
      ProblemIdea.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit),
      ProblemIdea.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};