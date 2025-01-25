import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import { DEFAULT_PROFILE_IMAGE } from '../../models/interfaces/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  profile: any = {}; // User profile data
  isEditing: boolean = false; // Edit mode
  profilePicture: string | null = ''; // Profile picture

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    console.log(userId)
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUser().subscribe({
      next: (user) => {
        console.log(user)
        this.profile = user;
        this.profilePicture = user.profileImage || DEFAULT_PROFILE_IMAGE; // Use default image
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
      },
    });
  }

  startEditing() {
    this.isEditing = true;
  }

  saveProfile() {
    const updatedProfile = {
      ...this.profile,
      profileImage: this.profilePicture,
    };

    this.authService.updateUserDetails(this.profile.id, updatedProfile).subscribe({
      next: () => {
        this.profile = updatedProfile;
        alert('Profile updated successfully!');
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        alert('Failed to update profile.');
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
