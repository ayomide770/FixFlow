import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';

import { PropertyApi } from '../property-api';
import { Property } from '../property';

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

@Component({
  selector: 'app-property-map',
  imports: [CommonModule, RouterLink],
  templateUrl: './property-map.html',
  styleUrl: './property-map.css'
})
export class PropertyMap implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer') private mapContainerRef!: ElementRef<HTMLDivElement>;

  private propertyApi = inject(PropertyApi);
  private cdr = inject(ChangeDetectorRef);
  private map: L.Map | null = null;

  properties: Property[] = [];
  mappedProperties: Property[] = [];
  loading = true;
  errorMessage = '';
  mapLoadError = '';

  ngAfterViewInit(): void {
    this.loadProperties();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  // GET: Retrieve all properties, then plot the ones with coordinates
  loadProperties(): void {
    this.loading = true;
    this.errorMessage = '';

    this.propertyApi.getProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.mappedProperties = data.filter(
          (property) => property.latitude !== null && property.longitude !== null
        );
        this.loading = false;
        this.cdr.detectChanges();
        this.initializeMap();
      },
      error: (err) => {
        console.error('Error loading properties for map:', err);
        this.errorMessage =
          'Unable to load properties. Is the backend server running?';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private initializeMap(): void {
    if (this.mappedProperties.length === 0 || !this.mapContainerRef) {
      return;
    }

    try {
      this.map = L.map(this.mapContainerRef.nativeElement);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      const markers: L.Marker[] = this.mappedProperties.map((property) => {
        const marker = L.marker([property.latitude as number, property.longitude as number]);

        marker.bindPopup(
          `<strong>${this.escapeHtml(property.propertyName)}</strong><br>` +
          `${this.escapeHtml(property.addressLine1)}<br>` +
          `${this.escapeHtml(property.city)}, ${this.escapeHtml(property.state)} ${this.escapeHtml(property.zipCode)}<br>` +
          `Status: ${this.escapeHtml(property.status)}`
        );

        marker.addTo(this.map as L.Map);
        return marker;
      });

      const group = L.featureGroup(markers);
      // Cap the zoom so a single property (or several clustered close
      // together) doesn't zoom all the way to street level, where the
      // area around the pin can appear blank if it has no mapped features.
      this.map.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: 15 });
    } catch (err) {
      console.error('Error initializing map:', err);
      this.mapLoadError =
        'Unable to load the map right now. Property data is still available in the list view.';
    }
  }

  // Prevent property data from being interpreted as HTML in the popup
  private escapeHtml(value: string): string {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }
}
