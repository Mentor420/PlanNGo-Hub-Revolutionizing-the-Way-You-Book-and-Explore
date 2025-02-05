import { Component,OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { PasswordModule } from 'primeng/password';
import {NgIf} from "@angular/common";  // Import PasswordModule for p-password

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        ButtonModule,
        CardModule,
        InputTextModule,
        FormsModule,  // Add FormsModule to support ngModel
        PasswordModule,
        RouterLink,
        NgIf,
        // Add PasswordModule to use p-password
    ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  login = {
    email: '',
    password: '',
  };
  userlogin:any=[];
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}
//  ngOnInit() {
//   this.authService.getId().subscribe(
//     (res) => {
//       console.log(res);
//       // Process the response here
//     },
//     (error) => {
//       console.error('Error:', error);
//     }
//   );
// }
onLogin() {
  const { email, password } = this.login;

  this.authService.getUserDetails().subscribe({
    next: (response) => {
      this.userlogin = response;
      console.log(this.userlogin);
      const user = this.userlogin.users.find(
          (u: { email: string; password: string }) => u.email === email && u.password === password
      );
      if (user) {
        localStorage.setItem('email', email);
        localStorage.setItem('role', user.role);

        if (user.role === 'Service Provider') {
          this.router.navigate(['service-provider']);
        } else if (user.role === 'Customer') {
          this.router.navigate(['home']);
        } else if (user.role === 'Admin') {
          this.router.navigate(['admin']);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Unknown Role',
            detail: 'User role is not recognized',
          });
        }

        // Call getId() with the logged-in user's email
        this.authService.getId(email).subscribe({
          next: (cabId: string) => {
            console.log('Cab ID:', cabId);
            // You can store or use the cabId here
            localStorage.setItem('cabId', cabId);
          },
          error: (error) => {
            console.error('Error getting cab ID:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to retrieve cab ID',
            });
          }
        });

      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid email or password',
        });
      }
    },
    error: (error) => {
      console.log(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong',
      });
    },
  });
}

}
