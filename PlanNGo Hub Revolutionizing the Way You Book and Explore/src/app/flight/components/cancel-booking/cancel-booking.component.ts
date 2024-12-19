import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightBookingService } from '../../services/flight-booking.service';

@Component({
  selector: 'app-cancel-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule ],
  templateUrl: './cancel-booking.component.html',
  styleUrl: './cancel-booking.component.css'
})
export class CancelBookingComponent implements OnInit{

  combinedData: any[] = [];

  constructor(private flightBookingService: FlightBookingService, private http:HttpClient) {}

  ngOnInit(): void {
    this.flightBookingService.getCombinedData().subscribe((data:any) => {
      console.log(data)
      this.combinedData = data;
    });
  }
  
  changeBookingStatus(id:String){
    const updatedData = {bookingStatus:'Cancelled'}
    this.http.patch(`http://localhost:3000/bookings/${id}`, updatedData)
    .subscribe({
      next:() => {
        this.flightBookingService.getCombinedData().subscribe((data:any) => {
          console.log(data)
          this.combinedData = data;
        });
      },
      error: (error) => {
        console.error('Error updating booking status:', error);
      }
    });
  }
}