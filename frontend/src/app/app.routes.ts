import { Routes } from '@angular/router';
import { PropertyManagement } from './property-management/property-management';
import { MaintenanceRequests } from './maintenance-requests/maintenance-requests';
import { WorkAssignments } from './work-assignments/work-assignments';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'maintenance-requests',
    pathMatch: 'full'
  },
  {
    path: 'properties',
    component: PropertyManagement
  },
  {
    path: 'maintenance-requests',
    component: MaintenanceRequests
  },
  {
    path: 'work-assignments',
    component: WorkAssignments
  },
  {
    path: '**',
    redirectTo: 'maintenance-requests'
  }
];