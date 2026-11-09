import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { PropertyApi } from '../property-api';

@Component({
  selector: 'app-property-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css'
})
export class PropertyForm implements OnInit {

  // Access Angular services
  private fb = inject(FormBuilder);
  private propertyApi = inject(PropertyApi);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  // Store the property ID when editing
  propertyId: string | null = null;
  submitted = false;
  loadError = '';
  saveError = '';

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

  propertyForm = this.fb.nonNullable.group({
    propertyName: ['', [Validators.required, Validators.minLength(3)]],
    propertyType: ['', Validators.required],
    addressLine1: ['', [Validators.required, Validators.minLength(5)]],
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

  get f() {
    return this.propertyForm.controls;
  }

  ngOnInit(): void {
    // Read the property ID from the URL, if present
    this.propertyId = this.route.snapshot.paramMap.get('id');

    if (this.propertyId) {
      // GET: Retrieve the existing property and prepopulate the form
      this.propertyApi.getProperty(this.propertyId).subscribe({
        next: (property) => {
          this.propertyForm.patchValue({
            propertyName: property.propertyName,
            propertyType: property.propertyType,
            addressLine1: property.addressLine1,
            addressLine2: property.addressLine2,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            status: property.status,
            notes: property.notes
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading property:', err);
          this.loadError = 'Unable to load this property.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.saveError = '';

    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    const propertyData = this.propertyForm.getRawValue();

    if (this.propertyId) {
      // PUT: Update the existing property
      this.propertyApi.updateProperty(this.propertyId, propertyData).subscribe({
        next: () => this.router.navigate(['/properties']),
        error: (err) => {
          console.error('Update failed:', err);
          this.saveError = 'Unable to update property. Please try again.';
          this.cdr.detectChanges();
        }
      });
    } else {
      // POST: Create a new property
      this.propertyApi.addProperty(propertyData).subscribe({
        next: () => this.router.navigate(['/properties']),
        error: (err) => {
          console.error('Save failed:', err);
          this.saveError = 'Unable to save property. Please try again.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
