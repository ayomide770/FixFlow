import { Routes } from '@angular/router';
import { PropertyManagement } from './property-management/property-management';
import { PropertyForm } from './property-management/property-form/property-form';
import { MaintenanceRequests } from './maintenance-requests/maintenance-requests';
import { MaintenanceRequestForm } from './maintenance-requests/maintenance-request-form/maintenance-request-form';
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
    path: 'maintenance-requests/new',
    component: MaintenanceRequestForm
  },
  {
    path: 'maintenance-requests/edit/:id',
    component: MaintenanceRequestForm
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