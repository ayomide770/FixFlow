const express = require('express');
const WorkAssignment = require('../models/workAssignment');

const router = express.Router();

// GET: Retrieve all work assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await WorkAssignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving work assignments'
    });
  }
});

// GET: Retrieve a work assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const assignment = await WorkAssignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        message: 'Work assignment not found'
      });
    }

    res.status(200).json(assignment);
  } catch (err) {
    res.status(400).json({
      message: 'Invalid work assignment ID'
    });
  }
});

// POST: Create a new work assignment
router.post('/', async (req, res) => {
  try {
    const assignment = new WorkAssignment(req.body);
    const saved = await assignment.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({
      message: 'Error saving work assignment',
      error: err.message
    });
  }
});

// PUT: Update an existing work assignment
router.put('/:id', async (req, res) => {
  try {
    const updated = await WorkAssignment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: 'Work assignment not found'
      });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({
      message: 'Error updating work assignment',
      error: err.message
    });
  }
});

// DELETE: Remove a work assignment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await WorkAssignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Work assignment not found'
      });
    }

    res.status(200).json({
      message: 'Work assignment deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      message: 'Error deleting work assignment'
    });
  }
});

module.exports = { path: '/api/work-assignments', router };
