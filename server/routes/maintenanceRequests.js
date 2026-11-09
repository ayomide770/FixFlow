const express = require('express');
const MaintenanceRequest = require('../models/maintenanceRequest');

const router = express.Router();

// GET: Retrieve all maintenance requests
router.get('/', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving maintenance requests'
    });
  }
});

// GET: Retrieve a maintenance request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: 'Maintenance request not found'
      });
    }

    res.status(200).json(request);
  } catch (err) {
    res.status(400).json({
      message: 'Invalid maintenance request ID'
    });
  }
});

// POST: Create a new maintenance request
router.post('/', async (req, res) => {
  try {
    const request = new MaintenanceRequest(req.body);
    const saved = await request.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({
      message: 'Error saving maintenance request',
      error: err.message
    });
  }
});

// PUT: Update an existing maintenance request
router.put('/:id', async (req, res) => {
  try {
    const updated = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: 'Maintenance request not found'
      });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({
      message: 'Error updating maintenance request',
      error: err.message
    });
  }
});

// DELETE: Remove a maintenance request
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MaintenanceRequest.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Maintenance request not found'
      });
    }

    res.status(200).json({
      message: 'Maintenance request deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      message: 'Error deleting maintenance request'
    });
  }
});

module.exports = { path: '/api/maintenance-requests', router };
