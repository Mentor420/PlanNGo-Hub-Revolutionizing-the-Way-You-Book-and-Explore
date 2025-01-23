import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FlightBookingService } from '../../../../services/customer/flight-booking.service';
import { HeaderComponent } from '../header/header.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, HeaderComponent, NgxSpinnerComponent, RouterOutlet ],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.css'
})
export class FlightComponent {
  flights: any[] = [];
  filteredFlights: any[] = [];
  userBookedFlights: any[] = []; //Store user's booked flights
  departure = '';
  destination = '';
  startDate = '';
  endDate = '';
  sortOrder: string = "";
  classType: string = ""
  isView = false;
  isDetailsView = false;
  isfailure = false
  viewDetails: any = {
    id: '',
    airline: '',
    logo: '',
    flightNumber: '',
    departure: { place: '', date: '', time: '' },
    destination: { place: '', date: '', time: '' },
    duration: '',
    price: 0,
  };

  constructor(private http: HttpClient, private flightBookingService: FlightBookingService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.spinner.show();
    // Load both flights and bookings
    this.loadFlightsAndBookings();
  }

  onRetry(){
    this.loadFlightsAndBookings();
  }

  // To load flights and bookings
  loadFlightsAndBookings() {
    this.flightBookingService.getFlights().subscribe({
      next: (flightsData) => {
        this.flights = flightsData.filter((data:any)=>(data.isActive !== false));
        this.isfailure = false;
  
        // Fetch user bookings
        this.flightBookingService.getBookings().subscribe({
          next: (bookingsData) => {
            this.userBookedFlights = bookingsData.map((booking: any) => booking.flightID);
  
            // Filter available flights
            this.filterAvailableFlights();
  
            // Hide spinner after delay
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
  
            // Sort flights
            this.sortFlights();
          },
          error: (bookingError) => {
            console.error('Error fetching bookings:', bookingError);
            this.isfailure = true;
            this.spinner.hide(); // Ensure spinner is hidden even on error
          },
        });
      },
      error: (flightError) => {
        console.error('Error fetching flights:', flightError);
        this.isfailure = true;
        this.spinner.hide(); // Ensure spinner is hidden even on error
      },
    });
  }

  // New function to filter available flights
  private filterAvailableFlights() {
    this.filteredFlights = this.flights.filter(flight => 
      !this.userBookedFlights.includes(flight.id)
    );
  }
 
  onSearch() {
    const filters = {
      departure: this.departure,
      destination: this.destination,
      startDate: this.startDate ? new Date(this.startDate).toISOString().split('T')[0] : '',
      endDate: this.endDate ? new Date(this.endDate).toISOString().split('T')[0] : '',
      classType: this.classType,
    };
  
    console.log('Filters:', filters); // Debugging
  
    this.filteredFlights = this.flights
      .filter(flight => !this.userBookedFlights.includes(flight.id))
      .filter(flight => {
        const flightDate = new Date(flight.departure.date).toISOString().split('T')[0];
        return (
          (!filters.departure || flight.departure.place.toLowerCase().includes(filters.departure.toLowerCase())) &&
          (!filters.destination || flight.destination.place.toLowerCase().includes(filters.destination.toLowerCase())) &&
          ((!filters.startDate || flightDate >= filters.startDate) &&
           (!filters.endDate || flightDate <= filters.endDate)) &&
          (!filters.classType || flight.classType.toLowerCase() === filters.classType.toLowerCase())
        );
      });
  
    console.log(this.classType);
  
    this.sortFlights();
    this.clearSearchInputs();
  }
  
  private clearSearchInputs() {
    this.departure = '';
    this.destination = '';
    this.startDate = '';
    this.endDate = '';
    this.classType = '';
    this.onCloseView();
  }  
  
  clearFilter() {
    this.sortOrder = "";
    this.departure = '';
    this.destination = '';
    this.classType = '';
    this.startDate = '';
    this.endDate = '';
    this.isView = false
    this.onSearch();
    this.onCloseView();
  }

  sortFlights() {
    if (this.sortOrder === 'highest') {
      this.filteredFlights.sort((a, b) => b.price - a.price);
    } else if (this.sortOrder === 'lowest') {
      this.filteredFlights.sort((a, b) => a.price - b.price);
    } else {
      this.filteredFlights.sort((a, b) => new Date(a.departure.date).getTime() - new Date(b.departure.date).getTime());
    }
  }

  onOpenView() {
    this.isView = true;
  }

  onCloseView() {
    this.isView = false;
  }

  onOpenDetails(data: any) {
    this.isDetailsView = true;
    this.viewDetails = data;
  }

  onCloseDetails() {
    this.isDetailsView = false;
    this.viewDetails = {
      id: '',
      airline: '',
      logo: '',
      flightNumber: '',
      departure: { place: '', date: '', time: '' },
      destination: { place: '', date: '', time: '' },
      duration: '',
      price: 0,
    };
  }
}