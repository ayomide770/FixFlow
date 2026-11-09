import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MaintenanceRequestApi } from './maintenance-request-api';
import { MaintenanceRequest } from './maintenance-request';

@Component({
  selector: 'app-maintenance-requests',
  imports: [CommonModule, RouterLink],
  templateUrl: './maintenance-requests.html',
  styleUrl: './maintenance-requests.css'
})
export class MaintenanceRequests implements OnInit {

  // Access Angular services
  private requestApi = inject(MaintenanceRequestApi);
  private cdr = inject(ChangeDetectorRef);

  // Store maintenance requests retrieved from MongoDB
  requests: MaintenanceRequest[] = [];
  loading = true;
  errorMessage = '';

  // ID of the request pending delete confirmation, if any
  pendingDeleteId: string | null = null;

  // Load requests when the component starts
  ngOnInit(): void {
    this.loadRequests();
  }

  // GET: Retrieve all maintenance requests
  loadRequests(): void {
    this.loading = true;
    this.errorMessage = '';

    this.requestApi.getRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading maintenance requests:', err);
        this.errorMessage =
          'Unable to load maintenance requests. Is the backend server running?';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Ask for confirmation before deleting a request
  confirmDelete(requestId: string): void {
    this.pendingDeleteId = requestId;
  }

  // Cancel a pending delete confirmation
  cancelDelete(): void {
    this.pendingDeleteId = null;
  }

  // DELETE: Remove the selected maintenance request
  onDelete(requestId: string): void {
    this.requestApi.deleteRequest(requestId).subscribe({
      next: () => {
        this.requests = this.requests.filter(
          (request) => request._id !== requestId
        );
        this.pendingDeleteId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.errorMessage = 'Unable to delete maintenance request.';
        this.pendingDeleteId = null;
        this.cdr.detectChanges();
      }
    });
  }

  // Map a status value to a CSS class suffix
  statusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }

  // Map a priority value to a CSS class suffix
  priorityClass(priority: string): string {
    return 'priority-' + priority.toLowerCase();
  }
}
