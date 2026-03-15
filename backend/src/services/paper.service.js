const Paper = require('../models/paper.model');
const { AppError } = require('../middleware/errorHandler');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildDateFilter = (dateRange) => {
  const now = new Date();
  switch (dateRange) {
    case 'this_week': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      start.setHours(0, 0, 0, 0);
      return { $gte: start };
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { $gte: start };
    }
    case 'last_3_months': {
      const start = new Date(now);
      start.setMonth(now.getMonth() - 3);
      return { $gte: start };
    }
    default:
      return undefined; // 'all_time' — no filter
  }
};

const toArray = (val) =>
  val === undefined ? undefined : Array.isArray(val) ? val : [val];

// ─── Create ───────────────────────────────────────────────────────────────────
const createPaper = async (userId, data) => {
  const paper = await Paper.create({ ...data, user: userId });
  return paper;
};

// ─── Get all (with filters + pagination) ─────────────────────────────────────
const getPapers = async (userId, filters) => {
  const {
    readingStage,
    researchDomain,
    impactScore,
    dateRange = 'all_time',
    page = 1,
    limit = 20,
    sortBy = 'dateAdded',
    sortOrder = 'desc',
  } = filters;

  const query = { user: userId };

  const stages = toArray(readingStage);
  if (stages) query.readingStage = { $in: stages };

  const domains = toArray(researchDomain);
  if (domains) query.researchDomain = { $in: domains };

  const impacts = toArray(impactScore);
  if (impacts) query.impactScore = { $in: impacts };

  const dateFilter = buildDateFilter(dateRange);
  if (dateFilter) query.dateAdded = dateFilter;

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [papers, total] = await Promise.all([
    Paper.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Paper.countDocuments(query),
  ]);

  return {
    papers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

// ─── Get one ──────────────────────────────────────────────────────────────────
const getPaperById = async (userId, paperId) => {
  const paper = await Paper.findOne({ _id: paperId, user: userId });
  if (!paper) throw new AppError('Paper not found.', 404);
  return paper;
};

// ─── Update ───────────────────────────────────────────────────────────────────
const updatePaper = async (userId, paperId, data) => {
  const paper = await Paper.findOneAndUpdate(
    { _id: paperId, user: userId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!paper) throw new AppError('Paper not found.', 404);
  return paper;
};

// ─── Delete ───────────────────────────────────────────────────────────────────
const deletePaper = async (userId, paperId) => {
  const paper = await Paper.findOneAndDelete({ _id: paperId, user: userId });
  if (!paper) throw new AppError('Paper not found.', 404);
};

module.exports = { createPaper, getPapers, getPaperById, updatePaper, deletePaper };
