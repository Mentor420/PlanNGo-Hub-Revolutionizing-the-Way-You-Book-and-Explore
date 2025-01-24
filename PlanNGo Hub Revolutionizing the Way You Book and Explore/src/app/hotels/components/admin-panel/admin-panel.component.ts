import { Component, OnInit, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdSidebarComponent } from './ad-sidebar/ad-sidebar.component';
import { CommonModule, isPlatformBrowser, PlatformLocation } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AdRoomDeatilsComponent } from './ad-room-deatils/ad-room-deatils.component';
import { AdHotelDeatilsComponent } from './ad-hotel-deatils/ad-hotel-deatils.component';
import { filter } from 'rxjs';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { platformBrowser } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [AdSidebarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, AfterViewInit {
  isSidebarOpen = true;
  searchQuery: string = '';
  totalHotels: number = 0;
  totalRooms: number = 0;
  totalBookings: number = 0;
  totalRevenue: number = 0;
  recentBookings: any[] = [];
  allRecentBookings: any[] = [];
  isChildRouteActive = false;
  providerBookings: { provider: string; bookings: number }[] = [];
  monthlyBookings: { month: string; count: number; revenue: number; }[] = [];
  bookingsByProviderChartInstance: Chart | null = null;
  monthlyBookingsChartInstance: Chart | null = null;

  @ViewChild(AdHotelDeatilsComponent) hotelDetails!: AdHotelDeatilsComponent;
  @ViewChild(AdRoomDeatilsComponent) roomDetails!: AdRoomDeatilsComponent;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.setupRouteListener();
    this.fetchData();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderBookingsByProviderChart();
      this.renderMonthlyBookingsChart();
    }
  }

  setupRouteListener(): void {
    if (typeof window !== 'undefined') {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        const currentRoute = this.router.url;
        this.isChildRouteActive = currentRoute.includes('ad-hotel-deatils') || currentRoute.includes('ad-room-details') || currentRoute.includes('ad-booking-history');
        sessionStorage.setItem('isChildRouteActive', JSON.stringify(this.isChildRouteActive));
        if(!this.isChildRouteActive) {
          this.ngOnInit();
        }
      });

      const storedRouteState = sessionStorage.getItem('isChildRouteActive');
      if (storedRouteState) {
        this.isChildRouteActive = JSON.parse(storedRouteState);
      }
    }
  }

  fetchData(): void {
    this.adminService.getAllHotels().subscribe(hotels => {
      this.totalHotels = hotels.length;
      this.totalRooms = hotels.reduce((acc, hotel) => acc + hotel.rooms.length, 0);
    });

    this.adminService.getRecentBookings().subscribe(bookings => {
      this.recentBookings = bookings;
      this.allRecentBookings = bookings;
      this.totalBookings = bookings.length;
      this.totalRevenue = bookings.reduce((acc, booking) => acc + booking.price, 0);
    });

    this.adminService.getProviderBookings().subscribe(data => {
      this.providerBookings = data;
      this.renderBookingsByProviderChart();
    });

    this.adminService.getMonthlyBookings().subscribe(data => {
      this.monthlyBookings = data;
      this.renderMonthlyBookingsChart();
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  filterRecents(): void {
    const query = this.searchQuery.toLowerCase();
    this.recentBookings = this.allRecentBookings.filter(
      (booking) =>
        booking.fullName.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.roomId.toString().includes(query) ||
        booking.hotelId.toLowerCase().includes(query)
    );
  }

  goToHotelDetails(): void {
    this.router.navigate(['/admin-panel/ad-booking-history']);
  }

  renderBookingsByProviderChart(): void {
    if (typeof document !== 'undefined') {
      const ctx = document.getElementById('bookingsByProviderChart') as HTMLCanvasElement;
  
      // Generate dynamic colors based on the number of providers
      const colors = this.generateDynamicColors(this.providerBookings.length);
  
      // Destroy existing chart instance if it exists
      if (this.bookingsByProviderChartInstance) {
        this.bookingsByProviderChartInstance.destroy();
      }
  
      // Create a new chart instance
      this.bookingsByProviderChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.providerBookings.map(item => item.provider),
          datasets: [{
            data: this.providerBookings.map(item => item.bookings),
            backgroundColor: colors, // Use dynamically generated colors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false, // Hide the default chart legend
            },
            title: {
              display: false,
            }
          }
        }
      });
  
      // Update the custom legend with the generated colors
      this.updateLegend(colors);
    }
  }
  
  // Function to generate dynamic colors
  generateDynamicColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
    }
    return colors;
  }
  
  // Function to update the legend dynamically
  updateLegend(colors: string[]): void {
    const legendContainer = document.querySelector('.chart-legend');
    if (legendContainer) {
      legendContainer.innerHTML = ''; // Clear existing legend
  
      this.providerBookings.forEach((item, index) => {
        const legendItem = document.createElement('li');
        legendItem.innerHTML = `
          <span class="legend-color" style="display: inline-block; width: 16px; height: 16px; background-color: ${colors[index]}; margin-right: 8px;"></span>
          ${item.provider}
        `;
        legendContainer.appendChild(legendItem);
      });
    }
  }
    
  
  renderMonthlyBookingsChart(): void {
    if (typeof document !== 'undefined') {
      const ctx = document.getElementById('monthlyBookingsChart') as HTMLCanvasElement;
  
      // Destroy existing chart instance if it exists
      if (this.monthlyBookingsChartInstance) {
        this.monthlyBookingsChartInstance.destroy();
      }
  
      // Create a new chart instance with dual axes
      this.monthlyBookingsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.monthlyBookings.map(item => item.month),
          datasets: [
            {
              label: 'Monthly Bookings',
              data: this.monthlyBookings.map(item => item.count),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              yAxisID: 'yBookings', // Link to the bookings axis
            },
            {
              label: 'Monthly Revenue',
              data: this.monthlyBookings.map(item => item.revenue),
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              yAxisID: 'yRevenue', // Link to the revenue axis
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            yBookings: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Bookings',
              },
              beginAtZero: true,
              ticks: {
                precision: 0, // Ensure integer values for bookings
              },
            },
            yRevenue: {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'Revenue',
              },
              beginAtZero: true,
              grid: {
                drawOnChartArea: false, // Avoid overlapping grid lines
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Monthly Bookings and Revenue',
              font:{
                size: 20,
                weight: 'bold',
              },
            },
          },
        },
      });
    }
  }
  
  
  
}