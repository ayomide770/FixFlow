import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Property, PropertyInput } from './property';

@Injectable({
  providedIn: 'root'
})
export class PropertyApi {

  // Access Angular HttpClient
  private http = inject(HttpClient);

  // Express backend API URL
  private apiUrl = 'http://localhost:8010/api/properties';

  // GET: Retrieve all properties
  getProperties() {
    return this.http.get<Property[]>(this.apiUrl);
  }

  // GET: Retrieve one property
  getProperty(id: string) {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  // POST: Create a property
  addProperty(property: PropertyInput) {
    return this.http.post<Property>(this.apiUrl, property);
  }

  // PUT: Update a property
  updateProperty(id: string, property: Partial<PropertyInput>) {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, property);
  }

  // DELETE: Remove a property
  deleteProperty(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
