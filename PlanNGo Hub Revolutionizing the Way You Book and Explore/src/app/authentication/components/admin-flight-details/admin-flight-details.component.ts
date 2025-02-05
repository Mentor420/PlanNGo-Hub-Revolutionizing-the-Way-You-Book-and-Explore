import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-flight-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-flight-details.component.html',
  styleUrls: ['./admin-flight-details.component.css'],
})
export class AdminFlightDetailsComponent implements OnInit {
  serviceProviders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (data) => {
        this.serviceProviders = data.filter(
          (provider) => provider.serviceType === 'Flight Service'
        );
      },
      (error) => {
        console.error('Error fetching service providers:', error);
      }
    );
  }
}
