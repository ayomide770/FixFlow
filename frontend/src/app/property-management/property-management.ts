import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PropertyApi } from './property-api';
import { Property } from './property';

@Component({
  selector: 'app-property-management',
  imports: [CommonModule, RouterLink],
  templateUrl: './property-management.html',
  styleUrl: './property-management.css'
})
export class PropertyManagement implements OnInit {

  // Access Angular services
  private propertyApi = inject(PropertyApi);
  private cdr = inject(ChangeDetectorRef);

  // Store properties retrieved from MongoDB
  properties: Property[] = [];
  searchTerm = '';
  loading = true;
  errorMessage = '';

  // ID of the property pending delete confirmation, if any
  pendingDeleteId: string | null = null;

  get filteredProperties(): Property[] {
    const term = this.searchTerm.trim().toLowerCase();
    return term ? this.properties.filter((property) =>
      [property.propertyName, property.propertyType, property.addressLine1,
        property.city, property.state, property.zipCode].some((value) =>
        value.toLowerCase().includes(term))) : this.properties;
  }

  // Load properties when the component starts
  ngOnInit(): void {
    this.loadProperties();
  }

  // GET: Retrieve all properties
  loadProperties(): void {
    this.loading = true;
    this.errorMessage = '';

    this.propertyApi.getProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading properties:', err);
        this.errorMessage =
          'Unable to load properties. Is the backend server running?';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Ask for confirmation before deleting a property
  confirmDelete(propertyId: string): void {
    this.pendingDeleteId = propertyId;
  }

  // Cancel a pending delete confirmation
  cancelDelete(): void {
    this.pendingDeleteId = null;
  }

  // DELETE: Remove the selected property
  onDelete(propertyId: string): void {
    this.propertyApi.deleteProperty(propertyId).subscribe({
      next: () => {
        this.properties = this.properties.filter(
          (property) => property._id !== propertyId
        );
        this.pendingDeleteId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.errorMessage = 'Unable to delete property.';
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
