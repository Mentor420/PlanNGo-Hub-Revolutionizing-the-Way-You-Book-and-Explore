import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Changed from NgIf to CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, ToastModule, FormsModule, CommonModule, RouterLink],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-18-primeng-app';
  showHeaderAndFooter: boolean = true;
  isHotelDropdownOpen = false;
  
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // List of admin routes where header and footer should be hidden
      const adminRoutes = ['/admin-panel', '/ad-hotel-deatils', '/ad-room-details'];
      this.showHeaderAndFooter = !adminRoutes.some(route =>
        this.router.url.startsWith(route)
      );
    });
  }

  


  // In app.component.ts
toggleHotelDropdown() {
    this.isHotelDropdownOpen = true;
    const handleMouseLeave = () => {
        this.closeDropdown();
    };
    document.addEventListener('mouseleave', handleMouseLeave);
}

toggleHotelChange() {
    const dropdown:any = document.querySelector('.dropdown');
    const dropdownMenu:any = document.querySelector('.dropdown-menu');
    
    // Add mouseleave event listeners
    dropdown.addEventListener('mouseleave', () => this.closeDropdown());
    dropdownMenu.addEventListener('mouseleave', () => this.closeDropdown());
}

isFlightDropdownOpen = false;
isTourDropdownOpen = false;
isCabDropdownOpen = false;

toggleFlightDropdown() { this.isFlightDropdownOpen = !this.isFlightDropdownOpen; }
toggleTourDropdown() { this.isTourDropdownOpen = !this.isTourDropdownOpen; }
toggleCabDropdown() { this.isCabDropdownOpen = !this.isCabDropdownOpen; }

closeDropdown() {
    this.isHotelDropdownOpen = false;
    // Remove event listeners to prevent memory leaks
    document.removeEventListener('mouseleave', () => this.closeDropdown());
}

private handleMouseLeave() {
    this.closeDropdown();
}

  isLoggedIn: boolean | undefined;
  login(){
    if(localStorage.getItem('email')){
      this.isLoggedIn = true;
    }
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn=false;
  }

  protected readonly localStorage = localStorage;
}