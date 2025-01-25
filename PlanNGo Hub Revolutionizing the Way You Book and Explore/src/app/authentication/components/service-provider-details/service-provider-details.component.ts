import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-service-provider-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],  // Add FormsModule here
  templateUrl: './service-provider-details.component.html',
  styleUrls: ['./service-provider-details.component.css'],
})
export class ServiceProviderDetailsComponent implements OnInit {
  providerId: string = '';
  provider: any = {
    fullName: '',
    email: '',
    phone: '',
    serviceType: '',
  };
  isEditing: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.providerId = this.route.snapshot.paramMap.get('id')!;
    
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (data) => {
        this.provider = data.find((p) => p.id === this.providerId);
      },
      (error) => {
        console.error('Error fetching provider details:', error);
      }
    );
  }

  startEditing(): void {
    this.isEditing = true;
  }

  saveChanges(): void {
    this.http.put(`http://localhost:3000/users/${this.provider.id}`, this.provider).subscribe(
      (response) => {
        console.log('Provider details updated:', response);
        this.isEditing = false;
      },
      (error) => {
        console.error('Error saving changes:', error);
      }
    );
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  deleteProvider(): void {
    this.http.delete(`http://localhost:3000/users/${this.provider.id}`).subscribe(
      (response) => {
        console.log('Provider deleted:', response);
      },
      (error) => {
        console.error('Error deleting provider:', error);
      }
    );
  }
}
