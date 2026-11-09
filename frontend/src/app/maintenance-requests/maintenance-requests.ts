import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-requests',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './maintenance-requests.html',
  styleUrl: './maintenance-requests.css'
})
export class MaintenanceRequests {

  maintenanceForm: FormGroup;
  submitted = false;
  successMessage = '';

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

  constructor(private fb: FormBuilder) {
    this.maintenanceForm = this.fb.group({
      issueTitle: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],

      description: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],

      category: ['', Validators.required],

      property: ['', Validators.required],

      priority: ['', Validators.required],

      requestDate: ['', Validators.required],

      status: ['Submitted', Validators.required]
    });
  }

  get f() {
    return this.maintenanceForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';

    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }

    console.log(
      'Maintenance Request Form Data:',
      this.maintenanceForm.value
    );

    this.successMessage =
      'Maintenance request submitted successfully! (Demo only — no database save.)';
  }

  onReset(): void {
    this.maintenanceForm.reset({
      issueTitle: '',
      description: '',
      category: '',
      property: '',
      priority: '',
      requestDate: '',
      status: 'Submitted'
    });

    this.submitted = false;
    this.successMessage = '';
  }
}