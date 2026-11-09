const mongoose = require('mongoose');

// Define the property schema
const propertySchema = new mongoose.Schema(
  {
    propertyName: { type: String, required: true },
    propertyType: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    status: { type: String, required: true, default: 'Active' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

// Create and export the model
module.exports = mongoose.model(
  'Property',
  propertySchema,
  'Properties'
);
