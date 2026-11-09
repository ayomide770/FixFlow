import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkAssignment, WorkAssignmentInput } from './work-assignment';

@Injectable({
  providedIn: 'root'
})
export class WorkAssignmentApi {

  // Access Angular HttpClient
  private http = inject(HttpClient);

  // Express backend API URL
  private apiUrl = 'http://localhost:8001/api/work-assignments';

  // GET: Retrieve all work assignments
  getAssignments() {
    return this.http.get<WorkAssignment[]>(this.apiUrl);
  }

  // GET: Retrieve one work assignment
  getAssignment(id: string) {
    return this.http.get<WorkAssignment>(`${this.apiUrl}/${id}`);
  }

  // POST: Create a work assignment
  addAssignment(assignment: WorkAssignmentInput) {
    return this.http.post<WorkAssignment>(this.apiUrl, assignment);
  }

  // PUT: Update a work assignment
  updateAssignment(id: string, assignment: Partial<WorkAssignmentInput>) {
    return this.http.put<WorkAssignment>(`${this.apiUrl}/${id}`, assignment);
  }

  // DELETE: Remove a work assignment
  deleteAssignment(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
