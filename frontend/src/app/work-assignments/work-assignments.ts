import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { WorkAssignmentApi } from './work-assignment-api';
import { WorkAssignment } from './work-assignment';

@Component({
  selector: 'app-work-assignments',
  imports: [CommonModule, RouterLink],
  templateUrl: './work-assignments.html',
  styleUrl: './work-assignments.css'
})
export class WorkAssignments implements OnInit {

  // Access Angular services
  private assignmentApi = inject(WorkAssignmentApi);
  private cdr = inject(ChangeDetectorRef);

  // Store work assignments retrieved from MongoDB
  assignments: WorkAssignment[] = [];
  loading = true;
  errorMessage = '';

  // ID of the assignment pending delete confirmation, if any
  pendingDeleteId: string | null = null;

  // Load assignments when the component starts
  ngOnInit(): void {
    this.loadAssignments();
  }

  // GET: Retrieve all work assignments
  loadAssignments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.assignmentApi.getAssignments().subscribe({
      next: (data) => {
        this.assignments = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading work assignments:', err);
        this.errorMessage =
          'Unable to load work assignments. Is the backend server running?';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Ask for confirmation before deleting an assignment
  confirmDelete(assignmentId: string): void {
    this.pendingDeleteId = assignmentId;
  }

  // Cancel a pending delete confirmation
  cancelDelete(): void {
    this.pendingDeleteId = null;
  }

  // DELETE: Remove the selected work assignment
  onDelete(assignmentId: string): void {
    this.assignmentApi.deleteAssignment(assignmentId).subscribe({
      next: () => {
        this.assignments = this.assignments.filter(
          (assignment) => assignment._id !== assignmentId
        );
        this.pendingDeleteId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.errorMessage = 'Unable to delete work assignment.';
        this.pendingDeleteId = null;
        this.cdr.detectChanges();
      }
    });
  }

  // Map a status value to a CSS class suffix
  statusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
