import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { MaintenanceRequestApi } from '../maintenance-request-api';

@Component({
  selector: 'app-maintenance-request-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './maintenance-request-form.html',
  styleUrl: './maintenance-request-form.css'
})
export class MaintenanceRequestForm implements OnInit {

  // Access Angular services
  private fb = inject(FormBuilder);
  private requestApi = inject(MaintenanceRequestApi);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  // Store the request ID when editing
  requestId: string | null = null;
  submitted = false;
  loadError = '';
  saveError = '';

  categories = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Structural',
    'General Maintenance',
    'Other'
  ];

  properties = [
    'Maplewood Apartments - Unit 101',
    'Maplewood Apartments - Unit 204',
    'Oakridge Residence - Unit 3B',
    'Riverside Commercial Plaza'
  ];

  priorities = [
    'Low',
    'Medium',
    'High',
    'Urgent'
  ];

  statuses = [
    'Submitted',
    'In Progress',
    'Resolved'
  ];

  maintenanceForm = this.fb.nonNullable.group({
    issueTitle: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', Validators.required],
    property: ['', Validators.required],
    priority: ['', Validators.required],
    requestDate: ['', Validators.required],
    status: ['Submitted', Validators.required]
  });

  get f() {
    return this.maintenanceForm.controls;
  }

  ngOnInit(): void {
    // Read the request ID from the URL, if present
    this.requestId = this.route.snapshot.paramMap.get('id');

    if (this.requestId) {
      // GET: Retrieve the existing request and prepopulate the form
      this.requestApi.getRequest(this.requestId).subscribe({
        next: (request) => {
          this.maintenanceForm.patchValue({
            issueTitle: request.issueTitle,
            description: request.description,
            category: request.category,
            property: request.property,
            priority: request.priority,
            requestDate: request.requestDate.substring(0, 10),
            status: request.status
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading maintenance request:', err);
          this.loadError = 'Unable to load this maintenance request.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.saveError = '';

    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }

    const requestData = this.maintenanceForm.getRawValue();

    if (this.requestId) {
      // PUT: Update the existing maintenance request
      this.requestApi.updateRequest(this.requestId, requestData).subscribe({
        next: () => this.router.navigate(['/maintenance-requests']),
        error: (err) => {
          console.error('Update failed:', err);
          this.saveError = 'Unable to update maintenance request. Please try again.';
          this.cdr.detectChanges();
        }
      });
    } else {
      // POST: Create a new maintenance request
      this.requestApi.addRequest(requestData).subscribe({
        next: () => this.router.navigate(['/maintenance-requests']),
        error: (err) => {
          console.error('Save failed:', err);
          this.saveError = 'Unable to save maintenance request. Please try again.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
