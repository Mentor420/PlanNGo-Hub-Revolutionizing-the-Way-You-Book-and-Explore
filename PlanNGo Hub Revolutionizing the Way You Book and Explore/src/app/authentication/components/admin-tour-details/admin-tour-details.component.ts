import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-tour-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-tour-details.component.html',
  styleUrls: ['./admin-tour-details.component.css'],
})
export class AdminTourDetailsComponent implements OnInit {
  serviceProviders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (data) => {
        this.serviceProviders = data.filter(
          (provider) => provider.serviceType === 'Tour Service'
        );
      },
      (error) => {
        console.error('Error fetching service providers:', error);
      }
    );
  }
}
