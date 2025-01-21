import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightBookingService } from '../../../../services/customer/flight-booking.service';
import { HeaderComponent } from '../header/header.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cancel-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent, NgxSpinnerComponent ],
  templateUrl: './cancel-booking.component.html',
  styleUrl: './cancel-booking.component.css'
})
export class CancelBookingComponent implements OnInit{

  combinedData: any[] = [];
  isCancelledBooking = false
  isFailure = false
  bookingId:String = ""
  isFetched = false;

  constructor(private flightBookingService: FlightBookingService, private http:HttpClient, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.combinedData = []
    this.spinner.show();
    this.flightBookingService.getCombinedData().subscribe((data:any) => {
      console.log(data)
      this.combinedData = data.filter((item: any) => item.bookings?.date)
      .sort((a: any, b: any) => new Date(b.bookings.date).getTime() - new Date(a.bookings.date).getTime());
      setTimeout(()=>{
        this.isFetched = true;
        this.spinner.hide();
      },1000) 
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
        this.isFailure = false
        this.isCancelledBooking = false
      },
      error: (error) => {
        console.error('Error updating booking status:', error);
        this.isFailure = true
      }
    });
  }

  onRetry(){
    this.changeBookingStatus();
  }
}