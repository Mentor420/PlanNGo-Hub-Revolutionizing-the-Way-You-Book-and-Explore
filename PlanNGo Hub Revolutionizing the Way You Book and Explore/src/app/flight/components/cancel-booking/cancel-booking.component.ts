import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightBookingService } from '../../services/flight-booking.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cancel-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent ],
  templateUrl: './cancel-booking.component.html',
  styleUrl: './cancel-booking.component.css'
})
export class CancelBookingComponent implements OnInit{

  combinedData: any[] = [];
  isCancelledBooking = false
  bookingId:String = ""

  constructor(private flightBookingService: FlightBookingService, private http:HttpClient) {}

  ngOnInit(): void {
    this.flightBookingService.getCombinedData().subscribe((data:any) => {
      console.log(data)
      this.combinedData = data.filter((item: any) => item.bookings?.date)
      .sort((a: any, b: any) => new Date(b.bookings.date).getTime() - new Date(a.bookings.date).getTime());
    });
  }

  onCancellingBooking(id:String) {
    this.isCancelledBooking = true
    this.bookingId = id
  }

  onCloseView(){
    this.isCancelledBooking = false
  }
  
  changeBookingStatus(){
    const updatedData = {bookingStatus:'Cancelled'}
    this.flightBookingService.changeFlightStatus(this.bookingId, updatedData)
    .subscribe({
      next:() => {
        this.flightBookingService.getCombinedData().subscribe((data:any) => {
          console.log(data)
          this.combinedData = data;
        });
        this.isCancelledBooking = false
      },
      error: (error) => {
        console.error('Error updating booking status:', error);
      }
    });
  }
}