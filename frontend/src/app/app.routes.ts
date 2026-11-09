import { Routes } from '@angular/router';
import { PropertyManagement } from './property-management/property-management';
import { PropertyForm } from './property-management/property-form/property-form';
import { MaintenanceRequests } from './maintenance-requests/maintenance-requests';
import { WorkAssignments } from './work-assignments/work-assignments';
import { WorkAssignmentForm } from './work-assignments/work-assignment-form/work-assignment-form';

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
    path: 'properties/new',
    component: PropertyForm
  },
  {
    path: 'properties/edit/:id',
    component: PropertyForm
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
    path: 'work-assignments/new',
    component: WorkAssignmentForm
  },
  {
    path: 'work-assignments/edit/:id',
    component: WorkAssignmentForm
  },
  {
    path: '**',
    redirectTo: 'maintenance-requests'
  }
];