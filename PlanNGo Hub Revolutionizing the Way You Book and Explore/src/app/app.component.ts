import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import {NgIf} from "@angular/common";  // Import FormsModule here

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, ToastModule, FormsModule, NgIf, RouterLink],  // Add FormsModule to imports
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-18-primeng-app';
  showHeaderAndFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // List of admin routes where header and footer should be hidden
      const adminRoutes = ['/admin-panel', '/ad-hotel-deatils', '/ad-room-details'];
      this.showHeaderAndFooter = !adminRoutes.some(route =>
        this.router.url.startsWith(route)
      );
    });
  }

  isLoggedIn: boolean | undefined;
  login(){
  if(localStorage.getItem('email')){
    this.isLoggedIn = true;
  }}


  logout() {
    localStorage.clear();
    this.isLoggedIn=false;
  }

  protected readonly localStorage = localStorage;
}
