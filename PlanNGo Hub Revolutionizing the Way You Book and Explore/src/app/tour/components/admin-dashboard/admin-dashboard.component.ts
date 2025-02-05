import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { TourService } from '../../services/tour.service';
import { forkJoin } from 'rxjs';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  title = 'ng-chart';
  jourchart: any = [];
  agencies: any = [];
  tours: any = [];
  toursdata: any = [];
  tourcompanies: any = [];
  finalcompanies: any = [];
  tourofcompanies: any = [];
  booking: any = [];
  totalBookingsForTourId: number = 0;
  tourNames: any = [];
  BookingsPerTourId: any = [];
  bookingsPerAgency: { [key: string]: number } = {};
  users: any = [];
  constructor(private tourService: TourService) {}

  ngOnInit() {
    forkJoin({
      tours: this.tourService.getTours(),
      tourCompanies: this.tourService.getTourCompanies(),
      bookings: this.tourService.getBookings(),
      users: this.tourService.getUsers()
    }).subscribe(({ tours, tourCompanies, bookings, users }) => {
      this.toursdata = tours.a;
      this.tourcompanies = tourCompanies;
      this.booking = bookings;
      this.users = users.users;
      console.log(users)
      this.finalcompanies = this.tourcompanies.map((company: any) => company.nameOfCompany);

      this.toursdata.forEach((tour: any) => {
        this.tourNames.push(tour.name);
      });

      this.finalcompanies.forEach((tour: any) => {
        let count = 0;
        this.toursdata.forEach((company: any) => {
          if (company.tourcompany === tour) {
            count++;
          }
        });
        this.tourofcompanies.push(count);
      });

      this.toursdata.forEach((tour: any) => {
        this.totalBookingsForTourId = this.getTotalBookingsForTourId(tour.id);
        this.BookingsPerTourId.push(this.totalBookingsForTourId);
      });

      this.totalBookingsForTourId = this.getTotalBookingsForTourId('a1b2c3d4');
      console.log(`Total bookings for tourId 'a1b2c3d4': ${this.totalBookingsForTourId}`);

      // Calculate bookings per agency
      this.bookingsPerAgency = this.getBookingsPerAgency();
      console.log('Bookings per agency:', this.bookingsPerAgency);

      this.initializeCharts();
    });
  }
  getTotalBookingsForTourId(tourId: string): number {
    let totalBookings = 0;
    for (const bookingKey in this.booking) {
      const booking = this.booking[bookingKey];
      if (Array.isArray(booking)) {
        booking.forEach(b => {
          if (b.tourId === tourId) {
            totalBookings++;
          }
        });
      } else if (booking.tourId === tourId) {
        totalBookings++;
      }
    }
    return totalBookings;
  }

  getBookingsPerAgency(): { [key: string]: number } {
    const bookingsPerAgency: { [key: string]: number } = {};

    for (const bookingKey in this.booking) {
      const booking = this.booking[bookingKey];
      if (Array.isArray(booking)) {
        booking.forEach(b => {
          const tour = this.toursdata.find((t: any) => t.id === b.tourId);
          if (tour) {
            const agencyName = tour.tourcompany;
            if (agencyName) {
              if (!bookingsPerAgency[agencyName]) {
                bookingsPerAgency[agencyName] = 0;
              }
              bookingsPerAgency[agencyName]++;
            }
          }
        });
      } else {
        const tour = this.toursdata.find((t: any) => t.id === booking.tourId);
        if (tour) {
          const agencyName = tour.tourcompany;
          if (agencyName) {
            if (!bookingsPerAgency[agencyName]) {
              bookingsPerAgency[agencyName] = 0;
            }
            bookingsPerAgency[agencyName]++;
          }
        }
      }
    }

    return bookingsPerAgency;
  }

  initializeCharts() {
    this.tours = new Chart('tr-canvas', {
      type: 'doughnut',
      data: {
        labels: this.finalcompanies,
        datasets: [
          {
            label: 'No of Tours by Tour Companies',
            data: this.tourofcompanies,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    this.agencies = new Chart('aj-canvas', {
      type: 'bar',
      data: {
        labels: this.tourNames,
        datasets: [
          {
            label: 'No of Bookings  per Tour',
            data: this.BookingsPerTourId,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const agencyNames = Object.keys(this.bookingsPerAgency);
    const bookingsData = Object.values(this.bookingsPerAgency);
    this.jourchart = new Chart('jr-canvas', {
      type: 'bar',
      data: {
        labels: agencyNames,
        datasets: [
          {
            label: '# of Votes',
            data: bookingsData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
