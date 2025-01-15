import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FlightBookingService } from '../../services/flight-booking.service';
import { HeaderComponent } from '../header/header.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, HeaderComponent, NgxSpinnerComponent ],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.css'
})
export class FlightComponent {
  flights: any[] = [];
  filteredFlights: any[] = [];
  departure = '';
  destination = '';
  startDate = '';
  endDate = '';
  sortOrder: string = "";
  isView = false;
  isDetailsView = false;
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
    this.flightBookingService.getFlights().subscribe((data) => {
      this.flights = data;
      this.filteredFlights = data;
      setTimeout(()=>{
        this.spinner.hide();
      },1000)
      this.sortFlights();
    });
  }

  onSearch() {
  const filters = {
    departure: this.departure,
    destination: this.destination,
    startDate: this.startDate ? new Date(this.startDate).toISOString().split('T')[0] : '',
    endDate: this.endDate ? new Date(this.endDate).toISOString().split('T')[0] : '',
  };

  this.filteredFlights = this.flights.filter(flight => {
    const flightDate = new Date(flight.departure.date).toISOString().split('T')[0];

    return (
      (!filters.departure || flight.departure.place.toLowerCase().includes(filters.departure.toLowerCase())) &&
      (!filters.destination || flight.destination.place.toLowerCase().includes(filters.destination.toLowerCase())) &&
      ((!filters.startDate || flightDate >= filters.startDate) &&
       (!filters.endDate || flightDate <= filters.endDate))
    );
  });

  // Sort flights based on the current sorting order
  this.sortFlights();

  // Reset filters and close the view
  this.departure = '';
  this.destination = '';
  this.startDate = '';
  this.endDate = '';
  this.onCloseView();
}

  clearFilter() {
    this.sortOrder = "";
    this.departure = '';
    this.destination = '';
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
    // Default sorting by date (ascending order)
    this.filteredFlights.sort((a, b) => new Date(a.departure.date).getTime() - new Date(b.departure.date).getTime());
  }
}


  onOpenView() {
    this.isView = true
  }

  onCloseView() {
    this.isView = false
  }

  onOpenDetails(data: any) {
    this.isDetailsView = true
    this.viewDetails = data;
  }

  onCloseDetails() {
    this.isDetailsView = false
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
