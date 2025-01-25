import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { passwordMismatchValidator } from '../../services/shared/password-mismatch.directive';
import { AuthService } from '../../services/services/auth.service';
import { RegisterPostData } from '../../models/interfaces/auth';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    RadioButtonModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private registerService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  registerForm = new FormGroup(
    {
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-z0-9\._%\+\-]+@[a-z0-9\.\-]+\.[a-z]{2,}$/),
      ]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      age: new FormControl('', [
        Validators.required,
        Validators.min(18),
        Validators.max(100),
      ]),
      role: new FormControl('', [Validators.required]),
      serviceType: new FormControl(''), // Optional, required only for Service Providers
    },
    {
      validators: passwordMismatchValidator,
    }
  );

  onRegister() {
    const role = this.registerForm.get('role')?.value;
    const serviceType =
      role === 'Service Provider'
        ? this.registerForm.get('serviceType')?.value || null
        : null;

    const postData: RegisterPostData = {
      fullName: this.registerForm.get('fullName')?.value ?? '',
      email: this.registerForm.get('email')?.value ?? '',
      password: this.registerForm.get('password')?.value ?? '',
      gender: this.registerForm.get('gender')?.value ?? '',
      age: Number(this.registerForm.get('age')?.value) || 0,
      role: role ?? '',
      serviceType: serviceType, // Set null for Customers, value for Service Providers
    };

    // Handle role-based ID generation
    if (postData.role === 'Customer') {
      postData.id = this.generateCustomerId();
    } else if (postData.role === 'Service Provider') {
      postData.id = this.generateServiceProviderId(postData.serviceType!);
    }

    // Check email uniqueness and register the user
    this.registerService.isEmailUnique(postData.email).subscribe({
      next: (isUnique) => {
        if (!isUnique) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email is already registered!',
          });
        } else {
          this.registerService.registerUser(postData).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Registered successfully',
              });
              this.router.navigate(['login']);
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong',
              });
            },
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error checking email uniqueness',
        });
      },
    });
  }

  // Helper methods for ID generation
  generateCustomerId(): string {
    const currentDate = new Date();
    const datePrefix = `${currentDate.getFullYear()}${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
    return `U-${datePrefix}-${Math.floor(Math.random() * 900) + 100}`;
  }

  generateServiceProviderId(serviceType: string): string {
    const prefix = serviceType.split(' ')[0].toUpperCase();
    const currentDate = new Date();
    const datePrefix = `${currentDate.getFullYear()}${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
    return `SP-${prefix}-${datePrefix}-${Math.floor(Math.random() * 900) + 100}`;
  }

  // Getters for form controls
  get fullName() {
    return this.registerForm.get('fullName') as FormControl;
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }

  get password() {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get gender() {
    return this.registerForm.get('gender') as FormControl;
  }

  get age() {
    return this.registerForm.get('age') as FormControl;
  }

  get role() {
    return this.registerForm.get('role') as FormControl;
  }

  get serviceType() {
    return this.registerForm.get('serviceType') as FormControl;
  }
}
