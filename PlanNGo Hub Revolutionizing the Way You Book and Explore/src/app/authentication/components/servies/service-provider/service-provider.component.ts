import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Import RouterModule here

@Component({
  selector: 'app-service-provider',
  standalone: true,
  imports: [RouterModule],  // Add RouterModule to imports array
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.css'],
})
export class ServiceProviderComponent {

  // Logic for logout or other functionality goes here
  logout() {
    sessionStorage.clear();  // Clear session storage
    // Redirect to login page
    window.location.href = '/login';
  }
}
