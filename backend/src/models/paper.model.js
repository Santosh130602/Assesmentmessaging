const mongoose = require('mongoose');

const RESEARCH_DOMAINS = [
  'Computer Science',
  'Biology',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Social Sciences',
];

const READING_STAGES = [
  'Abstract Read',
  'Introduction Done',
  'Methodology Done',
  'Results Analyzed',
  'Fully Read',
  'Notes Completed',
];

const IMPACT_SCORES = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];

const paperSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paperTitle: {
      type: String,
      required: [true, 'Paper title is required'],
      trim: true,
      minlength: [3, 'Paper title must be at least 3 characters'],
      maxlength: [500, 'Paper title cannot exceed 500 characters'],
    },
    firstAuthorName: {
      type: String,
      required: [true, 'First author name is required'],
      trim: true,
      minlength: [2, 'Author name must be at least 2 characters'],
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    researchDomain: {
      type: String,
      required: [true, 'Research domain is required'],
      enum: {
        values: RESEARCH_DOMAINS,
        message: `Research domain must be one of: ${RESEARCH_DOMAINS.join(', ')}`,
      },
    },
    readingStage: {
      type: String,
      required: [true, 'Reading stage is required'],
      enum: {
        values: READING_STAGES,
        message: `Reading stage must be one of: ${READING_STAGES.join(', ')}`,
      },
    },
    citationCount: {
      type: Number,
      required: [true, 'Citation count is required'],
      min: [0, 'Citation count cannot be negative'],
      max: [1000000, 'Citation count seems unrealistically high'],
    },
    impactScore: {
      type: String,
      required: [true, 'Impact score is required'],
      enum: {
        values: IMPACT_SCORES,
        message: `Impact score must be one of: ${IMPACT_SCORES.join(', ')}`,
      },
    },
    dateAdded: {
      type: Date,
      required: [true, 'Date added is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes for filter performance ─────────────────────────────────────────
paperSchema.index({ user: 1, readingStage: 1 });
paperSchema.index({ user: 1, researchDomain: 1 });
paperSchema.index({ user: 1, impactScore: 1 });
paperSchema.index({ user: 1, dateAdded: -1 });

// ─── Export constants alongside model ────────────────────────────────────────
const Paper = mongoose.model('Paper', paperSchema);

module.exports = Paper;
module.exports.RESEARCH_DOMAINS = RESEARCH_DOMAINS;
module.exports.READING_STAGES = READING_STAGES;
module.exports.IMPACT_SCORES = IMPACT_SCORES;
