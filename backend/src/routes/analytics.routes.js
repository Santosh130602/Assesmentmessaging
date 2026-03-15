const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analytics.controller');
const authenticate = require('../middleware/authenticate');

// All analytics routes require authentication
router.use(authenticate);

// Single combined endpoint (recommended for frontend — one round trip)
router.get('/', analyticsController.getAllAnalytics);

// Individual endpoints (for granular fetching if needed)
router.get('/funnel', analyticsController.getReadingStageFunnel);
router.get('/scatter', analyticsController.getCitationVsImpact);
router.get('/domain-matrix', analyticsController.getDomainReadingStageMatrix);
router.get('/summary', analyticsController.getSummary);

module.exports = router;
