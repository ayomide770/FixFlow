export interface WorkAssignment {
  _id: string;
  maintenanceRequest: string;
  technician: string;
  scheduledDate: string;
  estimatedHours: number;
  workDescription: string;
  status: string;
  notes: string;
}

// New work assignments do not have a MongoDB ID yet
export type WorkAssignmentInput = Omit<WorkAssignment, '_id'>;
