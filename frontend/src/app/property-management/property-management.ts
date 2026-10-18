import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-management.html',
  styleUrl: './property-management.css'
})
export class PropertyManagement {

  propertyForm: FormGroup;
  submitted = false;
  successMessage = '';

  propertyTypes = [
    'Residential',
    'Commercial',
    'Industrial',
    'Mixed-Use',
    'Other'
  ];

  statuses = [
    'Active',
    'Inactive',
    'Under Maintenance'
  ];

  constructor(private fb: FormBuilder) {
    this.propertyForm = this.fb.group({
      propertyName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      propertyType: ['', Validators.required],

      addressLine1: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],

      addressLine2: [''],

      city: ['', Validators.required],

      state: ['', Validators.required],

      zipCode: ['', [
        Validators.required,
        Validators.pattern(/^\d{5}(-\d{4})?$/)
      ]],

      status: ['Active', Validators.required],

      notes: ['']
    });
  }

  get f() {
    return this.propertyForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';

    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    console.log(
      'Property Form Data:',
      this.propertyForm.value
    );

    this.successMessage =
      'Property record saved successfully! (Demo only — no database save.)';
  }

  onReset(): void {
    this.propertyForm.reset({
      propertyName: '',
      propertyType: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      status: 'Active',
      notes: ''
    });

    this.submitted = false;
    this.successMessage = '';
  }
}
