// backend/models/ProblemIdea.js
const mongoose = require('mongoose');

const problemIdeaSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  domain: { 
    type: String, 
    required: true,
    enum: [
      'business', 'crime', 'culture', 'education', 
      'entertainment', 'environment', 'health', 'politics', 
      'science', 'sports', 'technology', 'weather'
    ]
  },
  problemStatement: { 
    type: String, 
    required: true 
  },
  coreFeatures: { 
    type: [String], 
    required: true,
    validate: [val => val.length === 4, 'Must provide exactly 4 core features']
  },
  articleUrl: { 
    type: String, 
    required: true, 
    unique: true // Prevents duplicate processing of the same news article
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ProblemIdea', problemIdeaSchema);