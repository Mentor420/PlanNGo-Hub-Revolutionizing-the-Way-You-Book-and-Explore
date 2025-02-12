import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-hotel-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-hotel-details.component.html',
  styleUrls: ['./admin-hotel-details.component.css'],
})
export class AdminHotelDetailsComponent implements OnInit {
  serviceProviders: any[] = []; // Store hotel service providers

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (data) => {
        this.serviceProviders = data.filter(
          (provider) => provider.serviceType === 'Hotel Service'
        );
      },
      (error) => {
        console.error('Error fetching service providers:', error);
      }
    );
  }
}
