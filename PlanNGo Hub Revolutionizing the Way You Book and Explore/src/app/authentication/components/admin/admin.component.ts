import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule, FormsModule],// Add FormsModule
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  // Doughnut Chart Data
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Customer 1', 'Customer 2', 'Customer 3', 'Customer 4'],
    datasets: [
      {
        data: [300, 500, 100, 200],
        backgroundColor: ['#007bff', '#ffc107', '#28a745', '#dc3545'],
      },
    ],
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Bar Chart Data
  public barChartData: ChartData<'bar'> = {
    labels: ['Cab Service', 'Hotel Service', 'Flight Service', 'Tour Service'],
    datasets: [
      {
        data: [50, 100, 150, 200],
        label: 'Service Providers',
        backgroundColor: '#007bff',
      },
    ],
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Customer Data
  public customers: any[] = [];
  public isEditing: boolean = false;
  public editingCustomer: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe((data) => {
      this.customers = data.filter((user) => user.role === 'Customer');
    });
  }

  startEditing(customer: any): void {
    this.isEditing = true;
    this.editingCustomer = { ...customer }; // Create a copy of the customer data
  }

  saveChanges(): void {
    this.http.put(`http://localhost:3000/users/${this.editingCustomer.id}`, this.editingCustomer).subscribe(() => {
      const index = this.customers.findIndex((c) => c.id === this.editingCustomer.id);
      if (index !== -1) {
        this.customers[index] = { ...this.editingCustomer }; // Update the customer in the table
      }
      this.isEditing = false;
      this.editingCustomer = null;
    });
  }

  deleteCustomer(id: string): void {
    this.http.delete(`http://localhost:3000/users/${id}`).subscribe(() => {
      this.customers = this.customers.filter((customer) => customer.id !== id);
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editingCustomer = null;
  }

  // Logout function
  logout(): void {
    sessionStorage.clear(); // Clear session storage
    alert('You have been logged out.');
    window.location.href = '/login'; // Redirect to login page
  }
}
