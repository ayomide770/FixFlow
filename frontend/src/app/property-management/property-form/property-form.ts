import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { retry, timeout } from 'rxjs';
import * as L from 'leaflet';

import { PropertyApi } from '../property-api';
import { PropertyInput } from '../property';

// OpenStreetMap's free geocoding service — no API key required.
// See usage policy: https://operations.osmfoundation.org/policies/nominatim/
const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

// Default map view when no location has been set yet — centered on
// Georgia, roughly matching the address examples used in this form.
const DEFAULT_CENTER: L.LatLngTuple = [32.1656, -82.9001];
const DEFAULT_ZOOM = 7;
const PINNED_ZOOM = 15;

// Leaflet's default marker icon assumes the bundler copies its image
// assets next to the JS — Angular's build doesn't, so marker icons
// silently fail to appear unless we point them at the CDN instead.
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

// Custom validator: value is optional, but if present must fall within [min, max]
function optionalRangeValidator(min: number, max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    }

    const value = Number(control.value);

    if (Number.isNaN(value)) {
      return { notANumber: true };
    }

    return value < min || value > max ? { outOfRange: { min, max } } : null;
  };
}

@Component({
  selector: 'app-property-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css'
})
export class PropertyForm implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mapContainer') private mapContainerRef!: ElementRef<HTMLDivElement>;

  // Access Angular services
  private fb = inject(FormBuilder);
  private propertyApi = inject(PropertyApi);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  // Store the property ID when editing
  propertyId: string | null = null;
  submitted = false;
  loadError = '';
  saveError = '';

  // Address-to-coordinates lookup (Nominatim) state
  geocoding = false;
  geocodeError = '';
  geocodeSuccess = '';

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
      Validators.pattern(/^(\d{5}(-\d{4})?|\d{6})$/)
    ]],
    status: ['Active', Validators.required],
    notes: [''],
    latitude: ['', optionalRangeValidator(-90, 90)],
    longitude: ['', optionalRangeValidator(-180, 180)]
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
            notes: property.notes,
            latitude: property.latitude === null ? '' : String(property.latitude),
            longitude: property.longitude === null ? '' : String(property.longitude)
          });
          this.cdr.detectChanges();

          if (property.latitude !== null && property.longitude !== null) {
            this.placeMarker(property.latitude, property.longitude, { pan: true, zoom: PINNED_ZOOM });
          }
        },
        error: (err) => {
          console.error('Error loading property:', err);
          this.loadError = 'Unable to load this property.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  ngAfterViewInit(): void {
    // The map container isn't rendered when the property failed to load
    if (!this.mapContainerRef) {
      return;
    }

    this.map = L.map(this.mapContainerRef.nativeElement).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.placeMarker(event.latlng.lat, event.latlng.lng);
      this.setFormCoordinates(event.latlng.lat, event.latlng.lng);
      this.geocodeSuccess = '';
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  // Place (or move) the location pin, optionally panning/zooming the map to it
  private placeMarker(lat: number, lng: number, options?: { pan: boolean; zoom: number }): void {
    if (!this.map) {
      return;
    }

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
      this.marker.on('dragend', () => {
        const position = this.marker!.getLatLng();
        this.setFormCoordinates(position.lat, position.lng);
        this.geocodeSuccess = '';
        this.cdr.detectChanges();
      });
    }

    if (options?.pan) {
      this.map.setView([lat, lng], options.zoom);
    }
  }

  private setFormCoordinates(lat: number, lng: number): void {
    this.propertyForm.patchValue({
      latitude: lat.toFixed(5),
      longitude: lng.toFixed(5)
    });
  }

  // Remove the pin and clear the stored coordinates
  clearLocation(): void {
    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    this.propertyForm.patchValue({ latitude: '', longitude: '' });
    this.geocodeSuccess = '';
    this.geocodeError = '';
  }

  get hasLocation(): boolean {
    const { latitude, longitude } = this.propertyForm.getRawValue();
    return latitude !== '' && longitude !== '';
  }

  // Look up latitude/longitude for the address currently entered in the form,
  // using OpenStreetMap's free Nominatim geocoding API.
  findCoordinates(): void {
    const { addressLine1, city, state, zipCode } = this.propertyForm.getRawValue();

    if (!addressLine1 || !city || !state) {
      this.geocodeError = 'Enter a street address, city, and state first.';
      this.geocodeSuccess = '';
      return;
    }

    this.geocoding = true;
    this.geocodeError = '';
    this.geocodeSuccess = '';

    const query = [addressLine1, city, state, zipCode].filter(Boolean).join(', ');
    const params = {
      format: 'json',
      limit: '1',
      q: query
    };

    // The public Nominatim instance is a shared community resource and can
    // be intermittently slow — give it a second, quick attempt before
    // reporting failure.
    this.http.get<NominatimResult[]>(NOMINATIM_SEARCH_URL, { params }).pipe(
      timeout(8000),
      retry({ count: 1, delay: 500 })
    ).subscribe({
      next: (results) => {
        // Always clear the loading state and re-render first — anything
        // that throws below (e.g. placing the map pin) must not leave the
        // button stuck showing "Searching...".
        this.geocoding = false;
        this.cdr.detectChanges();

        if (results.length === 0) {
          this.geocodeError =
            'No match found for that address. Try adjusting it, or enter coordinates manually.';
          this.cdr.detectChanges();
          return;
        }

        const [match] = results;
        const lat = Number(match.lat);
        const lng = Number(match.lon);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
          this.geocodeError = 'Received an invalid location for that address. Try again.';
          this.cdr.detectChanges();
          return;
        }

        try {
          this.setFormCoordinates(lat, lng);
          this.placeMarker(lat, lng, { pan: true, zoom: PINNED_ZOOM });
          this.geocodeSuccess = `Matched: ${match.display_name}`;
        } catch (err) {
          console.error('Error placing map pin:', err);
          this.geocodeError = 'Found the address, but could not place the pin. Try clicking the map instead.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Geocoding lookup failed:', err);
        this.geocoding = false;
        this.geocodeError = err?.name === 'TimeoutError'
          ? 'The location lookup timed out. Try again, or place the pin manually on the map.'
          : 'Unable to look up coordinates right now. Try again, or enter them manually.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.saveError = '';

    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    const rawValue = this.propertyForm.getRawValue();
    const propertyData: PropertyInput = {
      ...rawValue,
      latitude: rawValue.latitude === '' ? null : Number(rawValue.latitude),
      longitude: rawValue.longitude === '' ? null : Number(rawValue.longitude)
    };

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
