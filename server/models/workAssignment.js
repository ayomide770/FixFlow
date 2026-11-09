const mongoose = require('mongoose');

// Define the work assignment schema
const workAssignmentSchema = new mongoose.Schema(
  {
    maintenanceRequest: { type: String, required: true },
    technician: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    estimatedHours: { type: Number, required: true, min: 0.5, max: 40 },
    workDescription: { type: String, required: true },
    status: { type: String, required: true, default: 'Assigned' },
    notes: { type: String, default: '', maxlength: 250 }
  },
  { timestamps: true }
);

// Create and export the model
module.exports = mongoose.model(
  'WorkAssignment',
  workAssignmentSchema,
  'WorkAssignments'
);
