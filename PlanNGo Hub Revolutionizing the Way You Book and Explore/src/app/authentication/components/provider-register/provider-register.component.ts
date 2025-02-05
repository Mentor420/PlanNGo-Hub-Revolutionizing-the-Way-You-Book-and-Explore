import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import {RegisterPostData, Provider} from '../../models/interfaces/auth';
import { passwordMismatchValidator } from '../../services/shared/password-mismatch.directive';
import { AuthService } from '../../services/services/auth.service';
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";
import { PasswordModule } from "primeng/password";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-provider-register',
  standalone: true,
  imports: [
    DropdownModule,
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    PasswordModule,
    RadioButtonModule,
    InputTextModule,
    RouterLink
  ],
  templateUrl: './provider-register.component.html',
  styleUrl: './provider-register.component.css'
})
export class ProviderRegisterComponent {
  private registerService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  types = [
    {name: 'Tour Booking'},
    {name: 'Cab Booking'},
    {name: 'Hotel Booking'},
    {name: 'Flight Booking'},
  ];

  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/[a-z0-9\._%\+\-]+@[a-z0-9\.\-]+\.[a-z]{2,}$/)
    ]),
    type : new FormControl('', [Validators.required]),
    phone : new FormControl('', [Validators.required]),
    website : new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    description : new FormControl('', ),
    address : new FormControl('', [Validators.required]),

  }, {
    validators: passwordMismatchValidator
  });

  // Getter methods for form controls
  get address() {
    return this.registerForm.get('address')!;
  }
  get description() {
    return this.registerForm.get('description')!;
  }
  get phone() {
    return this.registerForm.get('phone')!;
  }
  get website() {
    return this.registerForm.get('website')!;
  }
  get fullName() {
    return this.registerForm.get('fullName')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }



  get role() {
    return this.registerForm.get('role')!;
  }

  get type() {
    return this.registerForm.get('type')!;
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.registerService.getUserDetails().subscribe({
        next: (response) => {
          // Check if email already exists
          const emailExists = response.users.some(user => user.email === this.email.value);

          if (!emailExists) {
            // Generate a random 4-character ID
            const newId = Math.random().toString(36).substring(2, 6);

            // Create new user object matching the required structure
            const newUser = {
              id: newId,
              fullName: this.fullName.value,
              email: this.email.value,
              password: this.password.value,
              role: 'Service Provider',
              type: this.type.value,
              phone: this.phone.value,
              website: this.website.value,
              description: this.description.value
            };

            // Add new user to existing users array
            const updatedUsers:any = {
              users: [...response.users, newUser]
            };

            // Send PUT request to update entire users array
            this.registerService.registerUser(updatedUsers).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Registration successful!'
                });
                this.router.navigate(['/login']);
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Registration failed. Please try again.'
                });
              }
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Email already exists'
            });
          }
        }
      });
    }
  }

}
