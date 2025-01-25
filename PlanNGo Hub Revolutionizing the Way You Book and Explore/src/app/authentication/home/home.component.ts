import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button'; // Import PrimeNG ButtonModule
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/services/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CommonModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router, private authService: AuthService) {}

  // Redirect to Dashboard
  goToDashboard() {
    if (typeof window !== 'undefined' && sessionStorage) {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  // Logout functionality
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
