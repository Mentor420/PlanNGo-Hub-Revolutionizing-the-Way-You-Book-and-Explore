import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightBookingService } from '../../services/flight-booking.service';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent {
  combinedData: any[] = [];
  isView = false;
  selectedPassengers: any[] = [];

  constructor(private flightBookingService: FlightBookingService, private http:HttpClient) {}

  onOpenView(id: string): void {
    const booking = this.combinedData.find((item) => item.id === id);

    if (booking && booking.bookings.passengers) {
      this.selectedPassengers = booking.bookings.passengers;
      console.log(this.selectedPassengers);
      this.isView = !this.isView; 
    }
  }

  onCloseView(): void {
    this.isView = !this.isView;
    this.selectedPassengers = [];
  }

  private updateBookingStatuses(): void {
    const currentDateTime = new Date();
    this.combinedData.forEach((item) => {
    const destinationDateTime = new Date(`${item.destination.date} ${item.destination.time}`);
    if (
      destinationDateTime.getTime() < currentDateTime.getTime() &&
      item.bookings.bookingStatus !== "Travel Ended"
    ) {
      const updatedData = {bookingStatus:'Travel Ended'}
      this.flightBookingService.changeFlightStatus(item.bookings.id, updatedData)
      .subscribe({
        next:(data) => {
          console.log(data)
      },
      error: (error) => {
        console.error('Error updating booking status:', error);
      }
    });
  }
    })
  }

  ngOnInit(): void {
    this.flightBookingService.getCombinedData().subscribe((data: any) => {
      this.combinedData = data
        .filter((item: any) => item.bookings?.date)
        .sort(
          (a: any, b: any) =>
            new Date(b.bookings.date).getTime() - new Date(a.bookings.date).getTime()
        );

      this.updateBookingStatuses();
    });
  }
}
