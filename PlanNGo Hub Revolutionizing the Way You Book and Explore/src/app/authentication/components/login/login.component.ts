import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    RouterLink,
    CommonModule, 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
  login = {
    email: '',
    password: '',
  };

  ngOnInit(): void {
    if (typeof window !== 'undefined' && sessionStorage) {
      const userId = sessionStorage.getItem('userId');
      const role = sessionStorage.getItem('role');
    

    if (!userId || !role) {
      // Redirect to login if userId or role is not found
      this.router.navigate(['/login']);
      return;
    }

    // Role-based routing
    switch (role) {
      case 'Admin':
        this.router.navigate(['/admin']);
        break;
      case 'Customer':
        this.router.navigate(['/']);
        break;
      default:
        break;
    }}
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogin() {
    const { email, password } = this.login;
  
    this.authService.getUserDetails(email, password).subscribe({
      next: (response) => {
        if (response.length >= 1) {
          const user = response[0];
  
          // Store userId in sessionStorage
          sessionStorage.setItem('userId', user.id); // Store userId instead of email
          sessionStorage.setItem('role', user.role);
  
          // Ensure serviceType is explicitly null if undefined
          const serviceType: string | null =
            user.role === 'Service Provider' ? user.serviceType ?? null : null;
  
          // Redirect based on role and serviceType
          this.redirectToDashboard(user.role, serviceType);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid email or password',
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong during login',
        });
      },
    });
  }
  
  
  
  
  private redirectToDashboard(role: string, serviceType: string | null) {
    switch (role) {
      case 'Customer':
        this.router.navigate(['home']); // Redirect Customers to home
        break;
      case 'Service Provider':
        if (serviceType) {
          switch (serviceType) {
            case 'Cab Service':
              this.router.navigate(['cab-service']);
              break;
            case 'Flight Service':
              this.router.navigate(['flight-service']);
              break;
            case 'Hotel Service':
              this.router.navigate(['hotel-service']);
              break;
            case 'Tour Service':
              this.router.navigate(['tour-service']);
              break;
            default:
              this.messageService.add({
                severity: 'warn',
                summary: 'Unknown Service Type',
                detail: 'Service type is not recognized',
              });
              break;
          }
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Missing Service Type',
            detail: 'Service type is required for Service Providers',
          });
        }
        break;
      case 'Admin':
        this.router.navigate(['admin']);
        break;
      default:
        this.messageService.add({
          severity: 'warn',
          summary: 'Unknown Role',
          detail: 'User role is not recognized',
        });
        break;
    }
  }
}  