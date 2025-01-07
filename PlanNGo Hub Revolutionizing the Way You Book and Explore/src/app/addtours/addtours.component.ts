import { Component } from '@angular/core';
import { TourService } from '../tour.service';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-addtours',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './addtours.component.html',
  styleUrl: './addtours.component.css'
})
export class AddtoursComponent {
  tourForm: FormGroup;
  tours: any[] = [];

  ngOnInit(): void {
    this.tourService.getTours().subscribe(data => {
      this.tours = [...this.tours,...data.a];

    });
  }
  constructor(private tourService: TourService, private fb: FormBuilder) {

    this.tourForm = this.fb.group({
      id: [''],
      name: [''],
      price: [''],
      duration: [''],
      description: [''],
      description2: [''],
      image: [''],
      images: [''],
      destination: [''],
      departure: [''],
      departureTime: [''],
      returnTime: [''],
      dressCode: [''],
      day1: [''],
      day2: [''],
      day3: [''],
      day4: [''],
      day5: [''],
      day6: [''],
      day7: ['']
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const tourData = {
      a: [...this.tours, this.tourForm.value]
    };
    console.log(tourData);
    this.tourService.updateTour("a", tourData).subscribe(
      response => {
        console.log('Tour updated successfully', response);
      },
      error => {
        console.error('Error updating tour', error);
      }
    );
  }
}
