import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ManageFlightsService } from '../../../../services/admin/manage-flights.service';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.css'
})
export class EditServiceComponent implements OnInit {
  flightForm: FormGroup;
  flightId: string = "";
  isUpdated = false
  isUpdateFailure = false

  constructor(private fb: FormBuilder, private http: HttpClient, private router:Router, private route:ActivatedRoute, private manageFlightsService:ManageFlightsService, private location:Location, private manageBookingComponent:ManageFlightsService) {
    this.flightForm = this.fb.group({
      airline: ['', [Validators.required, Validators.minLength(3)]],
      logo: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      flightNumber: ['', [Validators.required]],
      departure: this.fb.group({
        place: ['', [Validators.required]],
        date: ['', [Validators.required]],
        time: ['', [Validators.required]]
      }),
      destination: this.fb.group({
        place: ['', [Validators.required]],
        date: ['', [Validators.required]],
        time: ['', [Validators.required]]
      }),
      duration: ['', [Validators.required, Validators.pattern(/^\d+h\s\d+m$/)]],
      price: [0, [Validators.required, Validators.min(1)]],
      classType: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchFlightDetails();
  }

  fetchFlightDetails(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.manageBookingComponent.getSpecificFlights(id).subscribe(  
      (data: any) => {
        // Populate the form with fetched data
        this.flightForm.patchValue({
          id: data.id,
          airline: data.airline,
          logo: data.logo,
          flightNumber: data.flightNumber,
          departure: data.departure,
          destination: data.destination,
          duration: data.duration,
          price: data.price,
          classType: data.classType,
          isActive: data.isActive
        });
      },
      (error) => {
        console.error('Error fetching flight details:', error);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.flightForm.valid) {
      console.log('Updated Flight Data:', this.flightForm.value);

      // Send updated data to the server
      const id = this.route.snapshot.paramMap.get('id')
      this.manageFlightsService.updateFlight(id, this.flightForm.value).subscribe(
        (response) => {
          this.isUpdated = true
        setTimeout(()=>{
          this.isUpdated = false
          this.router.navigateByUrl("admin/flight")
        },2000)
        },
        (error) => {
          console.error('Error updating flight:', error);
        }
      );
    } else {
      this.isUpdateFailure = true
      setTimeout(()=>{
        this.isUpdateFailure = false
        this.router.navigateByUrl("admin/flight")
      },2000)
    }
  }

  onFlightToggle(){
    this.isUpdateFailure = !this.isUpdateFailure
  }
}
