const analyticsService = require('../services/analytics.service');

const getReadingStageFunnel = async (req, res, next) => {
  try {
    const data = await analyticsService.getReadingStageFunnel(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getCitationVsImpact = async (req, res, next) => {
  try {
    const data = await analyticsService.getCitationVsImpact(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getDomainReadingStageMatrix = async (req, res, next) => {
  try {
    const data = await analyticsService.getDomainReadingStageMatrix(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const data = await analyticsService.getSummary(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Single endpoint that returns ALL analytics at once (reduces round-trips)
const getAllAnalytics = async (req, res, next) => {
  try {
    const [funnel, scatterPlot, domainMatrix, summary] = await Promise.all([
      analyticsService.getReadingStageFunnel(req.user._id),
      analyticsService.getCitationVsImpact(req.user._id),
      analyticsService.getDomainReadingStageMatrix(req.user._id),
      analyticsService.getSummary(req.user._id),
    ]);

    res.status(200).json({
      success: true,
      data: { funnel, scatterPlot, domainMatrix, summary },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getReadingStageFunnel,
  getCitationVsImpact,
  getDomainReadingStageMatrix,
  getSummary,
  getAllAnalytics,
};
