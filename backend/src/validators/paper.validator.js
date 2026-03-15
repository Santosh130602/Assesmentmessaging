const Joi = require('joi');
const {
  RESEARCH_DOMAINS,
  READING_STAGES,
  IMPACT_SCORES,
} = require('../models/paper.model');

const paperBodySchema = Joi.object({
  paperTitle: Joi.string().trim().min(3).max(500).required().messages({
    'string.min': 'Paper title must be at least 3 characters',
    'string.max': 'Paper title cannot exceed 500 characters',
    'any.required': 'Paper title is required',
  }),
  firstAuthorName: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Author name must be at least 2 characters',
    'string.max': 'Author name cannot exceed 100 characters',
    'any.required': 'First author name is required',
  }),
  researchDomain: Joi.string()
    .valid(...RESEARCH_DOMAINS)
    .required()
    .messages({
      'any.only': `Research domain must be one of: ${RESEARCH_DOMAINS.join(', ')}`,
      'any.required': 'Research domain is required',
    }),
  readingStage: Joi.string()
    .valid(...READING_STAGES)
    .required()
    .messages({
      'any.only': `Reading stage must be one of: ${READING_STAGES.join(', ')}`,
      'any.required': 'Reading stage is required',
    }),
  citationCount: Joi.number().integer().min(0).max(1000000).required().messages({
    'number.min': 'Citation count cannot be negative',
    'number.max': 'Citation count seems unrealistically high',
    'any.required': 'Citation count is required',
  }),
  impactScore: Joi.string()
    .valid(...IMPACT_SCORES)
    .required()
    .messages({
      'any.only': `Impact score must be one of: ${IMPACT_SCORES.join(', ')}`,
      'any.required': 'Impact score is required',
    }),
  dateAdded: Joi.date().iso().max('now').required().messages({
    'date.max': 'Date added cannot be in the future',
    'any.required': 'Date added is required',
  }),
});

// For PATCH — all fields are optional
const paperUpdateSchema = paperBodySchema.fork(
  Object.keys(paperBodySchema.describe().keys),
  (field) => field.optional()
);

// Query filters for GET /papers
const paperFilterSchema = Joi.object({
  readingStage: Joi.alternatives().try(
    Joi.string().valid(...READING_STAGES),
    Joi.array().items(Joi.string().valid(...READING_STAGES))
  ),
  researchDomain: Joi.alternatives().try(
    Joi.string().valid(...RESEARCH_DOMAINS),
    Joi.array().items(Joi.string().valid(...RESEARCH_DOMAINS))
  ),
  impactScore: Joi.alternatives().try(
    Joi.string().valid(...IMPACT_SCORES),
    Joi.array().items(Joi.string().valid(...IMPACT_SCORES))
  ),
  dateRange: Joi.string()
    .valid('this_week', 'this_month', 'last_3_months', 'all_time')
    .default('all_time'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string()
    .valid('dateAdded', 'citationCount', 'paperTitle', 'createdAt')
    .default('dateAdded'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = { paperBodySchema, paperUpdateSchema, paperFilterSchema };
