import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { ServiceProviderService } from '../../../services/service-provider.service';
import { Booking, Hotel, Provider } from '../../../models/interfaces';

@Component({
  selector: 'app-service-provider',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './s-provider.component.html',
  styleUrls: ['./s-provider.component.css'],
})
export class ServiceProviderComponent implements OnInit {
  providerData = {
    name: '',
    hotels: [] as Hotel[],
    recentBookings: [] as Booking[],
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
  };

  public providerId = 'Provider1'; // Set dynamically based on the logged-in provider or selection

  constructor(private router: Router, private serviceProviderService: ServiceProviderService) {}

  ngOnInit(): void {
    this.fetchProviderData();
    this.fetchRecentBookings();
  }

  fetchProviderData(): void {
    this.serviceProviderService.getProviderDetails(this.providerId).subscribe((provider: Provider | null) => {
      if (provider) {
        this.providerData.name = provider.name;

        this.serviceProviderService.getHotelsByProvider(this.providerId).subscribe((hotels: Hotel[]) => {
          this.providerData.hotels = hotels;
          this.providerData.totalHotels = hotels.length;
          this.providerData.totalBookings = hotels.reduce(
            (total, hotel) => total + hotel.bookings.length,
            0
          );
          this.providerData.totalRevenue = hotels.reduce(
            (total, hotel) => total + hotel.bookings.reduce((sum, booking) => sum + booking.price, 0),
            0
          );

          // Initialize both charts after data is fetched
          this.createBookingsChart();
          this.createRevenueChart();
        });
      }
    });
  }

  // Fetch recent bookings
  fetchRecentBookings() {
    this.serviceProviderService.getRecentBookingsByProvider(this.providerId).subscribe((bookings) => {
      this.providerData.recentBookings = bookings;
    });
  }

  createBookingsChart(): void {
    if(typeof document !== 'undefined') {
      const ctx = document.getElementById('bookingsChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: this.providerData.hotels.map((hotel) => hotel.name),
            datasets: [
              {
                label: 'Bookings by Hotel',
                data: this.providerData.hotels.map((hotel) => hotel.bookings.length),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          },
        });
      }
    }
  }

  createRevenueChart(): void {
    if(typeof document !== 'undefined') {
      const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.providerData.hotels.map((hotel) => hotel.name),
            datasets: [
              {
                label: 'Revenue by Hotel',
                data: this.providerData.hotels.map((hotel) =>
                  hotel.bookings.reduce((sum, booking) => sum + booking.price, 0)
                ),
                backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Revenue (in Rupees)',
                },
              },
            },
          },
        });
      }
    }
  }

  getHotelRevenue(hotel: Hotel): number {
    if (!hotel.bookings || hotel.bookings.length === 0) {
      return 0; // No bookings, revenue is 0
    }

     return hotel.bookings
    .filter((booking) => booking.id) // Filter bookings that have a valid `id`
    .reduce((sum, booking) => sum + (typeof booking.price === 'number' ? booking.price : 0), 0); // Sum up valid prices
  }  

  viewDetails(providerId: string, hotelId: string): void {
    this.router.navigate(['/s-provider/service-hotel'], {
      queryParams: { providerId, hotelId },
    });
  }
}
