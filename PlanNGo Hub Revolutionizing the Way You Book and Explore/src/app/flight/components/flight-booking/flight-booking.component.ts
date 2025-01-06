import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightBookingService } from '../../services/flight-booking.service';
import { HeaderComponent } from '../header/header.component';
import { ViewSimilarFlightsComponent } from '../view-similar-flights/view-similar-flights.component';

@Component({
  selector: 'app-flight-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, ViewSimilarFlightsComponent],
  templateUrl: './flight-booking.component.html',
  styleUrl: './flight-booking.component.css'
})
export class FlightBookingComponent implements OnInit {
  flightBookingForm: FormGroup;
  flights:any = {}
  isBooked = false
  isBookingFailure = false

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.flightBookingService.getSpecificFlights(id).subscribe((data:any) => {
      this.flights = data;
    });
  }

  constructor(private fb: FormBuilder, private router:Router, private route:ActivatedRoute, private http:HttpClient, private flightBookingService: FlightBookingService) {
    this.flightBookingForm = this.fb.group({
      passengers: this.fb.array([this.createPassengerForm()])
    });
  }

  get passengers(): FormArray {
    return this.flightBookingForm.get('passengers') as FormArray;
  }

  createPassengerForm(): FormGroup {
    const uniqueID = this.generatePassengerID()
    return this.fb.group({
      id: [uniqueID],
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      gender: ['Male', Validators.required],
      passportNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  addPassenger(): void {
    this.passengers.push(this.createPassengerForm());
  }

  generatePassengerID(): string {
    return `P${Date.now()}`;
  }

  removePassenger(index: number): void {
    this.passengers.removeAt(index);
  }

  onBookingToggle(){
    this.isBookingFailure = !this.isBookingFailure
  }

  onSubmit(): void {
    if (this.flightBookingForm.valid) {
      const data = Date.now()
      const id = this.route.snapshot.paramMap.get('id')
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
      const booking = {
        id: `B${data}`,
        flightID: id,
        userID: "U1001",
        totalAmount: this.flights.price * this.passengers.length,
        bookingStatus: "Confirmed",
        date:formattedDate,
        passengers: [...this.flightBookingForm.value.passengers]
      }
      console.log(booking)
      this.http.post("http://localhost:3000/bookings",booking).subscribe((data:any)=>{
        this.isBooked = true
        setTimeout(()=>{
          this.isBooked = false
          this.router.navigateByUrl("/booking-history")
        },3000)
      })
    } else {
      this.isBookingFailure  = true
    }
  }
}
