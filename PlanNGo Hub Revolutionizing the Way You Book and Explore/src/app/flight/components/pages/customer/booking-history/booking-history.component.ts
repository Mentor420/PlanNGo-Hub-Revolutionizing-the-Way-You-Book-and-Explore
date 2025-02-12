import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightBookingService } from '../../../../services/customer/flight-booking.service';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import {DashboardComponent} from "../../../../../authentication/components/dashboard/dashboard.component";

@Component({
  selector: 'flight-app-booking-history',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NgxSpinnerComponent, DashboardComponent],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css'],
})
export class FlightBookingHistoryComponent implements OnInit {
  combinedData: any[] = [];
  isView = false;
  selectedPassengers: any[] = [];
  isFetched = false;
  isFailure = false

  constructor(
    private flightBookingService: FlightBookingService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {}

  onOpenView(id: string): void {
    const booking = this.combinedData.find((item) => item.id === id);

    if (booking && booking.passengers ) {
      this.selectedPassengers = booking.passengers;
      console.log(this.selectedPassengers)
      console.log(this.selectedPassengers);
      this.isView = !this.isView;
    }
  }

  onCloseView(): void {
    this.isView = !this.isView;
    this.selectedPassengers = [];
    this.isCancelledBooking = false

  }

  private updateBookingStatuses(): void {
    const currentDateTime = new Date();
    this.combinedData.forEach((item) => {
      const destinationDateTime = new Date(
        `${item.destination.date} ${item.destination.time}`
      );
      if (
        destinationDateTime.getTime() < currentDateTime.getTime() &&
        item.bookings.bookingStatus !== 'Travel Ended'
      ) {
        const updatedData = { bookingStatus: 'Travel Ended' };
        this.flightBookingService
          .changeFlightStatus(updatedData)
          .subscribe({
            next: (data) => {
              console.log(data);
            },
            error: (error) => {
              console.error('Error updating booking status:', error);
            },
          });
      }
    });
  }

  onRetry(){
    this.onFetchBooking();
    this.changeBookingStatus();
  }

  onFetchBooking(){
    this.combinedData = []
    this.spinner.show();
    this.flightBookingService.getCombinedData().subscribe({
      next: (data: any) => {
        
        this.combinedData = data
          .filter((item: any) => item?.date && item?.userEmail === localStorage.getItem('email'))
          .sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
          );
        console.log(data,"hello");
        setTimeout(()=>{
          this.isFetched = true;
          this.spinner.hide();
        },1000)

      },
      error: (error: any) => {
        console.error('Error fetching bookings:', error);
        this.spinner.hide();
      },
    });
  }




  //cancel booking
  isCancelledBooking = false
  bookingId:String = ""
  temp:any
  booking:any
  flights:any
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




}
