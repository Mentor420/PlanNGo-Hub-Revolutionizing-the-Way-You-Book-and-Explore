import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightBookingService } from '../../../../services/customer/flight-booking.service';
import { HeaderComponent } from '../header/header.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import {randomUUID} from "node:crypto";

@Component({
  selector: 'app-flight-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, NgxSpinnerComponent],
  templateUrl: './flight-booking.component.html',
  styleUrl: './flight-booking.component.css'
})
export class FlightBookingComponent implements OnInit {
  flightBookingForm: FormGroup;
  flights: any = {};
  isBooked = false;
  isBookingFailure = false;
  similerFlights: any[] = [];
  isFailure = false;
  id: any = "";
  temopraryData: any = {};
  temp2: any = [];
  temp3: any = [];
  temp4:any={};

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private spinner: NgxSpinnerService,
      private http: HttpClient,
      private flightBookingService: FlightBookingService
  ) {
    this.flightBookingForm = this.fb.group({
      passengers: this.fb.array([this.createPassengerForm()])
    });

    this.route.paramMap.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      console.log("Route parameter changed, new ID:", this.id);
      this.getFlightsDetails();
    });
  }

  ngOnInit(): void {
    this.getFlightsDetails();
  }

  get passengers(): FormArray {
    return this.flightBookingForm.get('passengers') as FormArray;
  }

  createPassengerForm(): FormGroup {
    const uniqueID = this.generatePassengerID();
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

  onBookingToggle(): void {
    this.isBookingFailure = !this.isBookingFailure;
  }

  onSubmit(): void {
    if (this.flightBookingForm.valid) {
      const booking = {

        date:Date.now(),
        flightID: this.id,
        userEmail:localStorage.getItem('email'),
        totalAmount: this.flights.price,
        bookingStatus:"Confirmed",
        passengers: [...this.flightBookingForm.value.passengers]
      };

      this.flightBookingService.getFlights().subscribe((data: any) => {
        this.temp4 = data;
        const updatedBookings = [...this.temp4.bookings, booking];
        const updatedBookingsData = { bookings: updatedBookings, flights: data.flights };
        console.log("booking data", updatedBookingsData);
        this.flightBookingService.postBookingDetails(updatedBookingsData).subscribe(
            () => {
              this.isBooked = true;
              setTimeout(() => {
                this.isBooked = false;
              }, 2000);
            },
            (error) => {
              console.error('Error in posting booking:', error);
              this.isBookingFailure = true;
              setTimeout(() => {
                this.isBookingFailure = false;
              }, 2000);
            }
        );
      });
    } else {
      this.isBookingFailure = true;
      setTimeout(() => {
        this.isBookingFailure = false;
      }, 2000);
    }
  }


  getSmilarFlights(departure: string): void {
    this.similerFlights = [];

    this.flightBookingService.getSpecificBooking().subscribe((data: any) => {
      this.temp2 = data.bookings;
      console.log("All bookings:", this.temp2);
    });

    this.flightBookingService.getSpecificDeparture().subscribe((data: any) => {
      this.temp3 = data.flights;
      console.log("All flights by departure:", this.temp3);

      // Collect the entire flight object if it matches the departure place
      this.temp3.forEach((flightItem: any) => {
        if (flightItem.departure.place === departure) {
          console.log("Matching flight:", flightItem);
          this.similerFlights.push(flightItem);
        }
      });

      console.log("List of similar flights:", this.similerFlights);
    });
  }

  navigateToFlight(flightId: string): void {
    console.log("Navigating to flight:", flightId);
    // Reassign ID and navigate
    this.id = flightId;
    this.router.navigate(['/flight', flightId]);
    // Fetch details for the new flight
    this.getFlightsDetails();
  }

  getFlightsDetails(): void {
    this.spinner.show();
    this.id = this.route.snapshot.paramMap.get('id');
    console.log("Getting details for flight ID:", this.id);

    this.flightBookingService.getSpecificFlights().subscribe(
        (response: any) => {
          // If response contains an array of flights, assign it
          this.temopraryData = response.flights || [];

          this.temopraryData.forEach((eachItem: any) => {
            if (eachItem.id === this.id) {
              this.flights = eachItem;
              console.log("Selected flight:", this.flights);
              this.getSmilarFlights(this.flights.departure.place);
            }
          });

          this.isFailure = false;
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        (error) => {
          console.error("Error fetching flight details:", error);
          this.isFailure = true;
          this.spinner.hide();
        }
    );
  }

  onRetry(): void {
    this.getFlightsDetails();
  }
}
