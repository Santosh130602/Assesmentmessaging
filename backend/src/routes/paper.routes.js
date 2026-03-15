const express = require('express');
const router = express.Router();

const paperController = require('../controllers/paper.controller');
const authenticate = require('../middleware/authenticate');
const { validate, validateQuery } = require('../middleware/validate');
const {
  paperBodySchema,
  paperUpdateSchema,
  paperFilterSchema,
} = require('../validators/paper.validator');

// All paper routes require authentication
router.use(authenticate);

router
  .route('/')
  .get(validateQuery(paperFilterSchema), paperController.getPapers)
  .post(validate(paperBodySchema), paperController.createPaper);

router
  .route('/:id')
  .get(paperController.getPaperById)
  .patch(validate(paperUpdateSchema), paperController.updatePaper)
  .delete(paperController.deletePaper);

module.exports = router;
