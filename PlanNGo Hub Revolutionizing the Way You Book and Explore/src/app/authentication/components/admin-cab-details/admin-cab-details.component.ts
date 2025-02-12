import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-cab-details',
  standalone: true,
  imports: [CommonModule, RouterModule], // Import CommonModule and RouterModule
  templateUrl: './admin-cab-details.component.html',
  styleUrls: ['./admin-cab-details.component.css'],
})
export class AdminCabDetailsComponent implements OnInit {
  serviceProviders: any[] = []; // Store the list of cab service providers

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch the list of service providers from the mock db.json
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (data) => {
        // Filter the providers whose serviceType is "Cab Service"
        this.serviceProviders = data.filter(
          (provider) => provider.serviceType === 'Cab Service'
        );
      },
      (error) => {
        console.error('Error fetching service providers:', error);
      }
    );
  }
}
