import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourService } from '../../services/tour.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  tourId: string | null = null;
  bookingForm: FormGroup;
  private tours: any;
  tourDescription: string | undefined;
  tourName: string | undefined;
  tourPrice: number | undefined;
  tourDuration: string | undefined;
  tourImages: string[] | undefined;
  tourDestination: string | undefined;
  tourDeparture: string | undefined;
  tourDepartureTime: string | undefined;
  tourReturnTime: string | undefined;
  tourDressCode: string | undefined;
  tourDescription2: string | undefined;

  constructor(private fb: FormBuilder, private tourService: TourService, private route: ActivatedRoute) {
    // Initialize form group with validation
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: localStorage.getItem('email'),
      confirmEmail: localStorage.getItem('email'),
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      date: ['', Validators.required],
      tickets: [1, [Validators.required, Validators.min(1)]],
      message: ['']
    });
  }

  /**
   * Generate a unique booking ID.
   */
  private generateBookingId(tourId: string): string {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${tourId}_BOOKING_${timestamp}_${randomNum}`;
  }

  ngOnInit(): void {
    // Get tour ID from route parameters
    this.route.paramMap.subscribe(params => {
      this.tourId = params.get('id');
    });

    this.tourService.getTours().subscribe(data => {
      this.tours = data.a;
      this.route.paramMap.subscribe(params => {
        const tourId = params.get('id');
        console.log(tourId);
        this.route.params.subscribe(params => {
          this.tourId = params['id'];
        });
        if (tourId) {
          const tour = this.tours.find((t: { id: string; }) => t.id == tourId);
          if (tour) {

            this.tourDescription = tour.description;
            this.tourDuration=tour.duration;
            this.tourName = tour.name;
            this.tourPrice = tour.price;
            this.tourImages = tour.images;
            this.tourDestination = tour.destination;
            this.tourDeparture = tour.departure;
            this.tourDepartureTime = tour.departureTime;
            this.tourReturnTime = tour.returnTime;

          } else {
            this.tourDescription = 'Description not found';
          }
        }
      });
    });

  }

  /**
   * Handle form submission.
   */
  onSubmit(): void {
    //userEmail add records

    const UserBooking={
      bookingId:this.tourId,
    }

    if (this.bookingForm.invalid) {
      alert('Please fill out the form correctly!');
      return;
    }

    if (this.bookingForm.value.email !== this.bookingForm.value.confirmEmail) {
      alert('Emails do not match!');
      return;
    }

    if (!this.tourId) {
      alert('Invalid tour ID!');
      return;
    }

    const bookingId = this.generateBookingId(this.tourId);

    // Construct booking data
    const newBooking = {
      bookingId,
      tourId: this.tourId,
      ...this.bookingForm.value,
      bookingDate: new Date().toISOString()
    };
    const bookId={
      bookingId:bookingId,
    }
    this.updateExistingBooking(bookingId, newBooking);
    this.UpdateUserBooking(this.bookingForm.value.email,bookId);
    console.log(bookId);
    console.log(this.bookingForm.value.email);
  }


  /**
   * Update an existing booking in user or add a new one if it doesn't exist.
   */
  UpdateUserBooking(email: string, booking: any): void {
    this.tourService.getUserBookings().subscribe(
      (UserBookings: any) => {
        let updatedBookings;

        if (UserBookings[email]) {
          // If email exists, append the new booking to existing records
          const existingBookings = Array.isArray(UserBookings[email])
            ? UserBookings[email]
            : [UserBookings[email]];

          updatedBookings = {
            ...UserBookings,
            [email]: [...existingBookings, booking]
          };
        } else {
          // If email doesn't exist, create new record
          updatedBookings = {
            ...UserBookings,
            [email]: [booking]
          };
        }

        this.tourService.addBookingToUser(email, updatedBookings).subscribe(
          response => {
            console.log('User booking added successfully', response);
            alert('Booking confirmed!');
          },
          error => {
            console.error('Error adding user booking', error);
            alert('Failed to add booking! Please try again.');
          }
        );
      }
    );
  }
  /**
   * Update an existing booking or add a new one if it doesn't exist.
   */
  updateExistingBooking(bookingId: string, newBooking: any): void {
    this.tourService.getBookings().subscribe(
      (existingBookings: any) => {
        // Merge the new booking with existing ones
        const updatedBookings = {
          ...existingBookings,
          [bookingId]: newBooking
        };


        // Send updated bookings to the server

        this.tourService.updateBookings(bookingId, updatedBookings).subscribe(
          response => {
            console.log('Booking updated successfully', response);
            alert('Booking updated successfully!');
            this.bookingForm.reset(); // Reset form after update
          },
          error => {
            console.error('Error updating booking', error);
            alert('Failed to update booking! Please try again later.');
          }
        );
      },
      error => {
        console.error('Error fetching existing bookings', error);
        alert('Failed to fetch existing bookings! Please try again later.');
      }
    );
  }
}
