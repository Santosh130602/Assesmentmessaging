const Paper = require('../models/paper.model');
const { READING_STAGES, RESEARCH_DOMAINS } = require('../models/paper.model');

/**
 * Funnel chart: paper count at each reading stage (ordered)
 */
const getReadingStageFunnel = async (userId) => {
  const results = await Paper.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$readingStage', count: { $sum: 1 } } },
  ]);

  const map = Object.fromEntries(results.map((r) => [r._id, r.count]));

  return READING_STAGES.map((stage) => ({
    stage,
    count: map[stage] || 0,
  }));
};

/**
 * Scatter plot data: each paper as a point with citationCount + impactScore
 */
const getCitationVsImpact = async (userId) => {
  const papers = await Paper.find({ user: userId })
    .select('paperTitle citationCount impactScore researchDomain')
    .lean();

  return papers.map((p) => ({
    id: p._id,
    title: p.paperTitle,
    citationCount: p.citationCount,
    impactScore: p.impactScore,
    domain: p.researchDomain,
  }));
};

/**
 * Stacked bar chart: papers grouped by domain and reading stage
 */
const getDomainReadingStageMatrix = async (userId) => {
  const results = await Paper.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: { domain: '$researchDomain', stage: '$readingStage' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Build a nested map: domain -> stage -> count
  const matrix = {};
  RESEARCH_DOMAINS.forEach((d) => {
    matrix[d] = {};
    READING_STAGES.forEach((s) => {
      matrix[d][s] = 0;
    });
  });

  results.forEach(({ _id: { domain, stage }, count }) => {
    if (matrix[domain]) matrix[domain][stage] = count;
  });

  // Return as array for chart consumption
  return RESEARCH_DOMAINS.map((domain) => ({
    domain,
    stages: READING_STAGES.map((stage) => ({
      stage,
      count: matrix[domain][stage],
    })),
  }));
};

/**
 * Summary stats:
 *  - Papers by reading stage
 *  - Average citations per domain
 *  - Completion rate (Fully Read / Total)
 */
const getSummary = async (userId) => {
  const [totalResult, byStage, byDomain, fullyRead] = await Promise.all([
    Paper.countDocuments({ user: userId }),

    Paper.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$readingStage', count: { $sum: 1 } } },
    ]),

    Paper.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$researchDomain',
          avgCitations: { $avg: '$citationCount' },
          count: { $sum: 1 },
        },
      },
    ]),

    Paper.countDocuments({ user: userId, readingStage: 'Fully Read' }),
  ]);

  const total = totalResult;
  const completionRate =
    total > 0 ? parseFloat(((fullyRead / total) * 100).toFixed(2)) : 0;

  const stageMap = Object.fromEntries(byStage.map((r) => [r._id, r.count]));
  const papersByStage = READING_STAGES.map((stage) => ({
    stage,
    count: stageMap[stage] || 0,
  }));

  const avgCitationsPerDomain = RESEARCH_DOMAINS.map((domain) => {
    const found = byDomain.find((r) => r._id === domain);
    return {
      domain,
      avgCitations: found ? parseFloat(found.avgCitations.toFixed(2)) : 0,
      paperCount: found ? found.count : 0,
    };
  });

  return {
    total,
    fullyRead,
    completionRate,
    papersByStage,
    avgCitationsPerDomain,
  };
};

module.exports = {
  getReadingStageFunnel,
  getCitationVsImpact,
  getDomainReadingStageMatrix,
  getSummary,
};
