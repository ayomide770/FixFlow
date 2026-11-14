export interface MaintenanceRequest {
  _id: string;
  issueTitle: string;
  description: string;
  category: string;
  property: string;
  priority: string;
  requestDate: string;
  status: string;
}

// New maintenance requests do not have a MongoDB ID yet
export type MaintenanceRequestInput = Omit<MaintenanceRequest, '_id'>;
