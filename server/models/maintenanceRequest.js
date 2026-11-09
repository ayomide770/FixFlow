const mongoose = require('mongoose');

// Define the maintenance request schema
const maintenanceRequestSchema = new mongoose.Schema(
  {
    issueTitle: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    property: { type: String, required: true },
    priority: { type: String, required: true },
    requestDate: { type: Date, required: true },
    status: { type: String, required: true, default: 'Submitted' }
  },
  { timestamps: true }
);

// Create and export the model
module.exports = mongoose.model(
  'MaintenanceRequest',
  maintenanceRequestSchema,
  'MaintenanceRequests'
);
