const express = require('express');
const Property = require('../models/property');

const router = express.Router();

// GET: Retrieve all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving properties'
    });
  }
});

// GET: Retrieve a property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    res.status(200).json(property);
  } catch (err) {
    res.status(400).json({
      message: 'Invalid property ID'
    });
  }
});

// POST: Create a new property
router.post('/', async (req, res) => {
  try {
    const property = new Property(req.body);
    const saved = await property.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({
      message: 'Error saving property',
      error: err.message
    });
  }
});

// PUT: Update an existing property
router.put('/:id', async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({
      message: 'Error updating property',
      error: err.message
    });
  }
});

// DELETE: Remove a property
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    res.status(200).json({
      message: 'Property deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      message: 'Error deleting property'
    });
  }
});

module.exports = router;
