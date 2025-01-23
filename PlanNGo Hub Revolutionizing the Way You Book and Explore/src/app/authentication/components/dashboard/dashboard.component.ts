import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add CommonModule here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  profile: any = {};
  isEditing: boolean = false;
  profilePicture: string | ArrayBuffer | null = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Load user details (from session storage or directly from service)
    this.profile = this.authService.getUser();
    this.profilePicture = this.profile.picture || '';
  }

  startEditing() {
    this.isEditing = true;
  }

  saveProfile() {
    // Create a new object with updated profile details, including the picture
    const updatedProfile = {
      ...this.profile,
      picture: this.profilePicture || this.profile.picture, // Ensure picture is updated
    };

    // Call the service to update the user's profile in the backend
    this.authService.updateUserDetails(this.profile.id, updatedProfile).subscribe({
      next: (response) => {
        // Update the current user profile in the service after updating backend
        this.authService.updateUser(updatedProfile);
        console.log('Profile updated:', updatedProfile);
        alert('Profile updated successfully!');
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile.');
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result;
        this.profile.picture = e.target.result; // Update the profile picture
      };
      reader.readAsDataURL(file);
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
