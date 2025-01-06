import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FlightBookingService } from '../../services/flight-booking.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, HeaderComponent ],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.css'
})
export class FlightComponent {
  flights: any[] = [];
  filteredFlights: any[] = [];
  departure = '';
  destination = '';
  date = '';
  sortOrder: string = "";
  isView = false
  isDetailsView=false
  viewDetails:any = {
    id: '',
    airline: '',
    logo: '',
    flightNumber: '',
    departure: { place: '', date: '', time: '' },
    destination: { place: '', date: '', time: '' },
    duration: '',
    price: 0,
  };

  constructor(private http: HttpClient, private flightBookingService: FlightBookingService) {}

  onOpenView(){
    this.isView = !this.isView
  }

  onCloseView(){
    this.isView = !this.isView
  }

  onOpenDetails(data:any){
    this.isDetailsView = !this.isDetailsView
    console.log(data)
    this.viewDetails = data
  }

  onCloseDetails(){
    this.isDetailsView = !this.isDetailsView
    this.viewDetails = {
      id: '',
      airline: '',
      logo: '',
      flightNumber: '',
      departure: { place: '', date: '', time: '' },
      destination: { place: '', date: '', time: '' },
      duration: '',
      price: 0,
    };;
  }

  ngOnInit() {
    this.flightBookingService.getFlights().subscribe((data) => {
      this.flights = data;
      this.filteredFlights = data;
      this.sortFlights();
    });
  }

  onSearch() {
    const filters = {
      departure: this.departure,
      destination: this.destination,
      date: this.date ? new Date(this.date).toISOString().split('T')[0] : '',
    };
  
    this.filteredFlights = this.flights.filter(flight => {
      const flightDate = new Date(flight.departure.date).toISOString().split('T')[0];
      return (
        (!filters.departure || flight.departure.place.toLowerCase().includes(filters.departure.toLowerCase())) &&
        (!filters.destination || flight.destination.place.toLowerCase().includes(filters.destination.toLowerCase())) &&
        (!filters.date || flightDate === filters.date)
      );
    });
    this.departure = '';
    this.destination = '';
    this.date = '';
    this.onCloseView()
  }
  
  clearFilter(){
    this.departure = '';
    this.destination = '';
    this.date = '';
    this.onSearch() 
  }

  sortFlights() {
    if (this.sortOrder === 'highest') {
      this.filteredFlights.sort((a, b) => b.price - a.price);
    } else if(this.sortOrder === 'lowest') {
      this.filteredFlights.sort((a, b) => a.price - b.price);
    }
  }
}