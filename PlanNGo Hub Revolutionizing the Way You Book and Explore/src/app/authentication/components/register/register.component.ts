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
import { RadioButtonModule } from 'primeng/radiobutton'; // Import RadioButtonModule
import { passwordMismatchValidator } from '../../services/shared/password-mismatch.directive';
import { AuthService } from '../../services/services/auth.service';
import { RegisterPostData } from '../../models/interfaces/auth';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {InputTextareaModule} from "primeng/inputtextarea";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


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
    DropdownModule,
    InputTextareaModule
    // Include RadioButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {


  image:any='';
  private s3Client = new S3Client({
    region: 'eu-central-1',
    endpoint: 'https://s3.tebi.io',
    credentials: {
      accessKeyId: 'zod2Wdh1FGRyTTdU',
      secretAccessKey: 'obGjYuDtXKMk4F3uhDxgI3mhkNAvSRnHhnsPWl7Q',
    },
    forcePathStyle: true
  });

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
        profileImage: new FormControl(null),
        description: new FormControl('', [
          Validators.required,
          Validators.maxLength(500),
        ]),
      },
      {
        validators: passwordMismatchValidator,
      }
  );

  private selectedFile: any | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size must be less than 5MB'
        });
        return;
      }

      // Validate file type
      if (!file.type.match(/image\/(jpeg|png|gif)/)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Only JPG, PNG and GIF files are allowed'
        });
        return;
      }

      this.selectedFile = file;
    }
  }

  async uploadImageToS3(file: any): Promise<string> {
    const bucketName = 'phg';
    const key = `uploads/${Date.now()}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: uint8Array,
      ContentType: file.type,
      ACL: 'public-read',
      // Add CORS headers
      Metadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      }
    });

    try {
      await this.s3Client.send(command);
      // Use direct S3 URL format
      const imageUrl = `https://${bucketName}.s3.tebi.io/${key}`;
      return imageUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  // Getter methods for form controls
  get fullName() {
    return this.registerForm.get('fullName')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }
  get description() {
    return this.registerForm.get('description')!;
  }
  get password() {
    return this.registerForm.get('password')!;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }

  get gender() {
    return this.registerForm.get('gender')!;
  }

  get age() {
    return this.registerForm.get('age')!;
  }

  get role() {
    return this.registerForm.get('role')!;
  }
  get profileImage() {
    return this.registerForm.get('profileImage')!;
  }
  get type() {
    return this.registerForm.get('type')!;
  }
  async onRegister() {
    if (this.registerForm.valid) {
      try {
        // Upload image first if file is selected
        let imageUrl = '';
        if (this.selectedFile) {
          imageUrl = await this.uploadImageToS3(this.selectedFile);
        }

        this.registerService.getUserDetails().subscribe({
          next: (response) => {
            const emailExists = response.users.some(user => user.email === this.email.value);

            if (!emailExists) {
              const newId = Math.random().toString(36).substring(2, 6);

              const newUser = {
                id: newId,
                fullName: this.fullName.value,
                email: this.email.value,
                password: this.password.value,
                gender: this.gender.value,
                age: Number(this.age.value),
                role: 'Customer',
                type: 'none',
                description: this.description.value,
                profileImage: imageUrl
              };

              // Add new user to existing users array
              const updatedUsers = {
                users: [...response.users, newUser]
              };

              // Send PUT request to update users
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
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload image. Please try again.'
        });
      }
    }
  }
}
