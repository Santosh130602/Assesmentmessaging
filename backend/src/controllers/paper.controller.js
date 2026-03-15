const paperService = require('../services/paper.service');

const createPaper = async (req, res, next) => {
  try {
    const paper = await paperService.createPaper(req.user._id, req.body);
    res.status(201).json({ success: true, data: { paper } });
  } catch (err) {
    next(err);
  }
};

const getPapers = async (req, res, next) => {
  try {
    const result = await paperService.getPapers(req.user._id, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getPaperById = async (req, res, next) => {
  try {
    const paper = await paperService.getPaperById(req.user._id, req.params.id);
    res.status(200).json({ success: true, data: { paper } });
  } catch (err) {
    next(err);
  }
};

const updatePaper = async (req, res, next) => {
  try {
    const paper = await paperService.updatePaper(req.user._id, req.params.id, req.body);
    res.status(200).json({ success: true, data: { paper } });
  } catch (err) {
    next(err);
  }
};

const deletePaper = async (req, res, next) => {
  try {
    await paperService.deletePaper(req.user._id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { createPaper, getPapers, getPaperById, updatePaper, deletePaper };
