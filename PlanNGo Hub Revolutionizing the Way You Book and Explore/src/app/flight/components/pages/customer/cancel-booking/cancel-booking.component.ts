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
  temp:any
  booking:any
  flights:any
  constructor(private flightBookingService: FlightBookingService, private http:HttpClient, private spinner: NgxSpinnerService) {}
  finalData:any={}
  ngOnInit(): void {
    this.combinedData = []
    this.spinner.show();
    this.flightBookingService.getCombinedData().subscribe((data:any) => {
      console.log(data)
      this.combinedData = data.filter((item: any) => item?.date && item?.userEmail === localStorage.getItem('email'))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTimeout(()=>{
        this.isFetched = true;
        this.spinner.hide();
      },1000) 
    });
    //temp


  }

  onCancellingBooking(id:String) {
    this.isCancelledBooking = true
    this.bookingId = id
    console.log("okay")
  }

  onCloseView(){
    this.isCancelledBooking = false
  }

  changeBookingStatus() {
    this.flightBookingService.getBookings().subscribe((data:any) => {
      this.booking=data.bookings;
      this.flights=data.flights;
      const updatedData = { bookingStatus: 'Cancelled' };

      this.booking.forEach((booking: any, index: number) => {
        if (this.bookingId === booking.flightID) {
          // Update the booking with the new data
          this.booking[index] = { ...booking, ...updatedData };
          console.log("Updated booking:", this.booking[index]);
        }
      });
      this.finalData={bookings:this.booking,flights:this.flights}
      console.log({bookings:[this.booking],flights:[this.flights]},"let begion")
      this.flightBookingService.changeFlightStatus(this.finalData).subscribe({
        next: () => {
          console.log('Booking status updated successfully',this.finalData);
          this.isFailure = false;
          this.isCancelledBooking = false;
          window.location.reload();
        },
        error: (error) => {
          console.error('Error updating booking status:', error);
          this.isFailure = true;
        }
      });
    })


    }




  onRetry(){
    this.changeBookingStatus();
  }
}