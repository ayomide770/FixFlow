import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  selector: 'app-work-assignments',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './work-assignments.html',
  styleUrl: './work-assignments.css'
})
export class WorkAssignments {

  assignmentForm: FormGroup;
  submitted = false;
  successMessage = '';

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

  constructor(private fb: FormBuilder) {
    this.assignmentForm = this.fb.group({
      maintenanceRequest: ['', Validators.required],

      technician: ['', Validators.required],

      scheduledDate: ['', [
        Validators.required,
        notPastDateValidator
      ]],

      estimatedHours: ['', [
        Validators.required,
        Validators.min(0.5),
        Validators.max(40)
      ]],

      workDescription: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],

      status: ['Assigned', Validators.required],

      notes: ['', Validators.maxLength(250)]
    });
  }

  get f() {
    return this.assignmentForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';

    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    console.log(
      'Work Assignment Form Data:',
      this.assignmentForm.value
    );

    this.successMessage =
      'Work assignment created successfully! (Demo only — no database save.)';
  }

  onReset(): void {
    this.assignmentForm.reset({
      maintenanceRequest: '',
      technician: '',
      scheduledDate: '',
      estimatedHours: '',
      workDescription: '',
      status: 'Assigned',
      notes: ''
    });

    this.submitted = false;
    this.successMessage = '';
  }
}
