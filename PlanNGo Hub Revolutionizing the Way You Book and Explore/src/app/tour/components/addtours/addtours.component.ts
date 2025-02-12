import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TourService } from '../../services/tour.service';
import {NgForOf, NgIf} from "@angular/common";
import { FormsModule } from '@angular/forms'; // Import FormsModule to support ngModel

@Component({
  selector: 'app-addtours',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
    NgIf,
    // Include FormsModule for ngModel
  ],
  templateUrl: './addtours.component.html',
  styleUrl: './addtours.component.css'
})
export class AddtoursComponent implements OnInit {
  tourForm: FormGroup;
  tours: any[] = [];
  // If needed, you can store full sets of form data in this array.
  // For now, it stores the tours we fetch from the service.
  tourplans: string[] = [];        // Stores daily plan text entries
  dayCounter: number = 1;          // Counter to label days
  currentTourPlan: string = '';    // The text for the daily plan we want to add

  constructor(private tourService: TourService, private fb: FormBuilder) {
    // Add some basic Validators for demonstration
    this.tourForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      duration: ['', Validators.required],
      description: ['', Validators.required],
      description2: [''],
      image: [''],
      images: [''],
      destination: ['', Validators.required],
      departure: ['', Validators.required],
      departureTime: ['', Validators.required],
      returnTime: ['', Validators.required],
      dressCode: [''],
      tourplans: [[]],
      serviceprovider: localStorage.getItem('name') || '',
    });
  }

  ngOnInit(): void {
    this.tourService.getTours().subscribe({
      next: (data) => {
        // The "a" property in your JSON is appended to our local array
        this.tours = [...this.tours, ...data.a];
      },
      error: (err) => {
        console.error('Error fetching tours:', err);
        alert('Failed to load tours data. Please try again later.');
      }
    });
  }

  /**
   * Adds a new daily plan text to the tourplans array
   * only if it isn't empty or whitespace.
   */
  addTourPlan(): void {
    if (this.currentTourPlan.trim().length === 0) {
      alert('Please enter a valid tour plan for the day.');
      return;
    }

    // Add the new plan to our tourplans array
    this.tourplans.push(this.currentTourPlan.trim());

    // Update form control data and increment counter
    this.tourForm.patchValue({ tourplans: this.tourplans });
    this.dayCounter++;
    // Clear the current field
    this.currentTourPlan = '';
  }

  /**
   * Called when the form is submitted.
   * Validates the form, logs form data, and updates the tours if everything is valid.
   */
  onSubmit(event: Event): void {
    event.preventDefault();

    // If the form is invalid, prevent submission and show an alert
    if (this.tourForm.invalid) {
      alert('Please fill out all required fields before submitting.');
      return;
    }

    const formValue = this.tourForm.value;
    console.log('Form Value:', formValue);

    // Merge the existing tours with the newly added one
    const updatedTours = [...this.tours, formValue];
    const tourData = {
      a: updatedTours
    };

    console.log('Sending updated tour data to the server:', tourData);

    this.tourService.updateTour( tourData).subscribe({
      next: response => {
        alert('Tour updated successfully.');
        // Optionally reset the form or fetch updated tours from the server
        this.tourForm.reset();
        this.tourplans = [];
        this.dayCounter = 1;
      },
      error: error => {
        console.error('Error updating tour:', error);
        alert('Error updating tour. Please try again later.');
      }
    });
  }
}
