import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { WorkAssignmentApi } from '../work-assignment-api';
import { WorkAssignmentInput } from '../work-assignment';

// Custom validator: the scheduled date cannot be earlier than today
export function notPastDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const selected = new Date(control.value + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected < today ? { pastDate: true } : null;
}

@Component({
  selector: 'app-work-assignment-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './work-assignment-form.html',
  styleUrl: './work-assignment-form.css'
})
export class WorkAssignmentForm implements OnInit {

  // Access Angular services
  private fb = inject(FormBuilder);
  private assignmentApi = inject(WorkAssignmentApi);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  // Store the assignment ID when editing
  assignmentId: string | null = null;
  submitted = false;
  loadError = '';
  saveError = '';

  maintenanceRequests = [
    'MR-1001 - Leaking kitchen sink (Maplewood Unit 101)',
    'MR-1002 - Faulty hallway lighting (Maplewood Unit 204)',
    'MR-1003 - AC not cooling (Oakridge Unit 3B)',
    'MR-1004 - Cracked entrance tile (Riverside Plaza)'
  ];

  technicians = [
    'Kwame Asante - Plumber',
    'Sarah Johnson - Electrician',
    'David Lee - HVAC Technician',
    'Maria Lopez - General Maintenance'
  ];

  statuses = [
    'Assigned',
    'Scheduled',
    'In Progress',
    'Completed'
  ];

  assignmentForm = this.fb.nonNullable.group({
    maintenanceRequest: ['', Validators.required],
    technician: ['', Validators.required],
    scheduledDate: ['', [Validators.required, notPastDateValidator]],
    estimatedHours: ['', [
      Validators.required,
      Validators.min(0.5),
      Validators.max(40)
    ]],
    workDescription: ['', [Validators.required, Validators.minLength(10)]],
    status: ['Assigned', Validators.required],
    notes: ['', Validators.maxLength(250)]
  });

  get f() {
    return this.assignmentForm.controls;
  }

  ngOnInit(): void {
    // Read the assignment ID from the URL, if present
    this.assignmentId = this.route.snapshot.paramMap.get('id');

    if (this.assignmentId) {
      // GET: Retrieve the existing assignment and prepopulate the form
      this.assignmentApi.getAssignment(this.assignmentId).subscribe({
        next: (assignment) => {
          this.assignmentForm.patchValue({
            maintenanceRequest: assignment.maintenanceRequest,
            technician: assignment.technician,
            scheduledDate: assignment.scheduledDate.substring(0, 10),
            estimatedHours: String(assignment.estimatedHours),
            workDescription: assignment.workDescription,
            status: assignment.status,
            notes: assignment.notes
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading work assignment:', err);
          this.loadError = 'Unable to load this work assignment.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.saveError = '';

    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    const rawValue = this.assignmentForm.getRawValue();
    const assignmentData: WorkAssignmentInput = {
      ...rawValue,
      estimatedHours: Number(rawValue.estimatedHours)
    };

    if (this.assignmentId) {
      // PUT: Update the existing work assignment
      this.assignmentApi.updateAssignment(this.assignmentId, assignmentData).subscribe({
        next: () => this.router.navigate(['/work-assignments']),
        error: (err) => {
          console.error('Update failed:', err);
          this.saveError = 'Unable to update work assignment. Please try again.';
          this.cdr.detectChanges();
        }
      });
    } else {
      // POST: Create a new work assignment
      this.assignmentApi.addAssignment(assignmentData).subscribe({
        next: () => this.router.navigate(['/work-assignments']),
        error: (err) => {
          console.error('Save failed:', err);
          this.saveError = 'Unable to save work assignment. Please try again.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
