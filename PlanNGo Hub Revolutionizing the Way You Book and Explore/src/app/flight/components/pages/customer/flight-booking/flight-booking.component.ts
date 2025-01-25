import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightBookingService } from '../../../../services/customer/flight-booking.service';
import { HeaderComponent } from '../header/header.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-flight-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, NgxSpinnerComponent],
  templateUrl: './flight-booking.component.html',
  styleUrl: './flight-booking.component.css'
})
export class FlightBookingComponent implements OnInit {
  flightBookingForm: FormGroup;
  flights:any = {}
  isBooked = false
  isBookingFailure = false
  similerFlights:any[] = []
  isFailure = false
  id:any = ""

  ngOnInit(): void {
    this.getFlightsDetails()
  }

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService, private http: HttpClient, private flightBookingService: FlightBookingService) {
    this.flightBookingForm = this.fb.group({
      passengers: this.fb.array([this.createPassengerForm()])
    });
  
    this.route.paramMap.subscribe((params) => {
      this.id = this.route.snapshot.paramMap.get("id");
      console.log("Route parameter changed, new ID:", this.id);
      this.getFlightsDetails();
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
      this.flightBookingService.postBookingDetails(booking).subscribe((data:any)=>{
        this.isBooked = true
        setTimeout(()=>{
          this.isBooked = false
          this.router.navigateByUrl("flight/booking/history")
        },2000)
      })
    } else {
      this.isBookingFailure  = true
      setTimeout(()=>{
        this.isBookingFailure  = false
      },2000)
    }
  }

  getSmilarFlights(departure: any){
    const id = this.route.snapshot.paramMap.get('id')
    let bookingDetails = []
    this.flightBookingService.getSpecificBooking(id).subscribe((data)=>{
      bookingDetails = data
    })
    this.flightBookingService.getSpecificDeparture(departure).subscribe((data:any)=>{
      this.similerFlights = data.filter((eachItem:any) => eachItem.id !== id && eachItem.isActive!==false);
      console.log(data)
    })
  }

  navigateToFlight(id: string): void {
    console.log("Navigating to flight:", id);
    this.id = id;
    this.router.navigate(['/flight', id]);
    this.getFlightsDetails();
    // setTimeout(()=>{
    //   location.reload()
    // },100)
  }

  getFlightsDetails() {
    this.spinner.show()
    this.id = this.route.snapshot.paramMap.get('id');
    console.log("Getting details for flight ID:", this.id);
    this.flightBookingService.getSpecificFlights(this.id).subscribe(
      (data: any) => {
        console.log("Flight details:", data);
        this.flights = data;
        this.getSmilarFlights(data.departure.place);
        this.isFailure = false
        setTimeout(()=>{
          this.spinner.hide()
        }, 1000)
      },
      (error) => {
        console.error("Error fetching flight details:", error)
        this.isFailure = true
      }
    );
  }

  onRetry(){
    this.getFlightsDetails();
  }
}
