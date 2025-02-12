import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourService } from '../../services/tour.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {forkJoin, map} from 'rxjs';
@Component({
  selector: 'app-manage-booking',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './manage-booking.component.html',
  styleUrl: './manage-booking.component.css'
})
export class ManageBookingComponent implements OnInit {
  bookingForm: FormGroup;
  bookings: any;
  bookingFinal:any=[];
  dataSubmit:any;
  tempBooking:any;
  isEditing: boolean = false;
  bookingData:any;
  tours:any=[];
  constructor(
    private fb: FormBuilder,
    private tourService: TourService
  ) {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      date: ['', Validators.required],
      tickets: [1, [Validators.required, Validators.min(1)]],
      message: ['']
    }, {
      validators: this.emailMatchValidator
    });
  }

  public name:any=localStorage.getItem('email') ? localStorage.getItem('email') : '';

  ngOnInit(): void {
    // To get The image and other details from getTours
    console.log(this.name);
    forkJoin({
      userBookings: this.tourService.getUserBookings(),
      bookings: this.tourService.getBookings(),
      tours: this.tourService.getTours()
    }).pipe(
      map(({ userBookings, bookings, tours }) => {
        // Get user's booking IDs
        const userBookingIds = userBookings[this.name].map((b: { bookingId: string }) => b.bookingId);
        console.log('User booking IDs:', userBookings);
        // Get full booking details for user's bookings
        const userBookingDetails = userBookingIds.map((id: string) => bookings[id]);

        // Match tours with booking details
        return tours.a.filter((tour: { id: string }) =>
          userBookingDetails.some((booking: { tourId: string }) => booking.tourId === tour.id)
        );
      })
    ).subscribe(matchedTours => {
      this.tours = matchedTours;
      console.log('Matched tours:', this.tours);
    });
    // To modify records
    this.tourService.getUserBookings().subscribe(
      data => {
        this.bookings = data[this.name];
        console.log(this.bookings);
        // Loop through each booking to get bookingId
        this.bookings.forEach((booking: any) => {

          // Now you can use each bookingId to fetch booking details
          this.tourService.getBookings().subscribe(
            data => {
              this.bookingFinal=[...this.bookingFinal,data[booking.bookingId]];
              this.bookingFinal.forEach(
                (booking: any) => {
                  this.tourService.getTours().subscribe(
                    (data) => {
                      this.bookingData = data.a;

                      this.bookingData.forEach(
                        (tour: any) => {
                          if (tour.id === booking.tourId) {

                          }
                        }
                      )
                    }
                  )
                }
              )
            }
          );
        });
      }
    );
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      // First get existing bookings
      this.tourService.getBookings().subscribe(
        existingBookings => {
          // Create updated booking data
          const updatedBooking = {
            ...existingBookings,
            [this.selectedBookingId]: {
              bookingId: this.selectedBookingId,
              tourId: this.currentTourId,
              name: this.bookingForm.value.name,
              email: this.bookingForm.value.email,
              confirmEmail: this.bookingForm.value.confirmEmail,
              phone: this.bookingForm.value.phone,
              date: this.bookingForm.value.date,
              tickets: this.bookingForm.value.tickets,
              message: this.bookingForm.value.message,
              bookingDate: new Date().toISOString()
            }
          };

          // Update the booking
          this.tourService.updateBookings(this.selectedBookingId,updatedBooking).subscribe(
            response => {
              this.loadBookings(); // Refresh the bookings list
              this.isEditing = false;
              this.resetForm();
            }
          );
        }
      );
    }
  }
  selectedBookingId: string = '';
  currentTourId: string = '';

  editBooking(booking: any): void {
    this.isEditing = true;
    this.selectedBookingId = booking.bookingId;
    this.currentTourId = booking.tourId;
    this.bookingForm.patchValue({
      name: booking.name,
      email: booking.email,
      confirmEmail: booking.email,
      phone: booking.phone,
      date: booking.date,
      tickets: booking.tickets,
      message: booking.message
    });
  }

  deleteBooking(bookingId: string): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      // First get existing bookings
      this.tourService.getBookings().subscribe({
        next: (existingBookings) => {
          // Create new bookings object without the deleted booking
          const updatedBookings = { ...existingBookings };
          delete updatedBookings[bookingId];

          // Get user bookings and update them
          this.tourService.getUserBookings().subscribe({
            next: (userBookings) => {
              // Filter out the deleted booking from user bookings
              const updatedUserBookings = { ...userBookings };
              updatedUserBookings[this.name] = updatedUserBookings[this.name].filter(
                (booking: any) => booking.bookingId !== bookingId
              );

              // Update both bookings and user bookings
              forkJoin({
                bookings: this.tourService.deleteBooking(updatedBookings),
                userBookings: this.tourService.deleteUserBooking(updatedUserBookings)
              }).subscribe({
                next: () => {
                  this.loadBookings(); // Refresh the bookings list
                },
                error: (error) => {
                  console.error('Error deleting booking:', error);
                }
              });
            }
          });
        }
      });
    }
  }

  loadBookings(): void {
    this.bookingFinal = [];
    this.tourService.getUserBookings().subscribe(data => {
      const name = localStorage.getItem('email');
      this.bookings = data[this.name];
      this.bookings.forEach((booking: any) => {
        this.tourService.getBookings().subscribe(data => {
          this.bookingFinal = [...this.bookingFinal, data[booking.bookingId]];
        });
      });
    });
  }
  resetForm(): void {
    this.bookingForm.reset({
      tickets: 1
    });
  }

  private emailMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
  }
}

