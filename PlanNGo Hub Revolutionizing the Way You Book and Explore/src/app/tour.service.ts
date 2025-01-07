import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private apiUrl = 'http://localhost:3000/0';

  constructor(private http: HttpClient) {}

  getTours(): Observable<any> {
    return from(fetch(this.apiUrl).then(response => response.json()));
  }
  updateTour(tourId: string, tourData: any): Observable<any> {
    const url = 'http://localhost:3000/0';
    return this.http.put(url, tourData);
  }
  deleteTour(id: string): Observable<any> {
    const url = 'http://localhost:3000/0';
    return this.http.delete(url);
  }
}
