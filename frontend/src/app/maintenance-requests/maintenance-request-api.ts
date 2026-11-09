import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaintenanceRequest, MaintenanceRequestInput } from './maintenance-request';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestApi {

  // Access Angular HttpClient
  private http = inject(HttpClient);

  // Express backend API URL
  private apiUrl = 'http://localhost:8001/api/maintenance-requests';

  // GET: Retrieve all maintenance requests
  getRequests() {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl);
  }

  // GET: Retrieve one maintenance request
  getRequest(id: string) {
    return this.http.get<MaintenanceRequest>(`${this.apiUrl}/${id}`);
  }

  // POST: Create a maintenance request
  addRequest(request: MaintenanceRequestInput) {
    return this.http.post<MaintenanceRequest>(this.apiUrl, request);
  }

  // PUT: Update a maintenance request
  updateRequest(id: string, request: Partial<MaintenanceRequestInput>) {
    return this.http.put<MaintenanceRequest>(`${this.apiUrl}/${id}`, request);
  }

  // DELETE: Remove a maintenance request
  deleteRequest(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
