import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../../model/employee';
import { AdminCabService } from '../../../services/admin-cab.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emp-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
  <div class="popup-overlay" (click)="onClose()">
    <div class="popup-content" (click)="$event.stopPropagation()">
      <div class="container">
        <div class="header">
          <h2>Employee Registration</h2>
        </div>
        <form [formGroup]="empForm" (ngSubmit)="onSubmit()">
          <div class="form-columns">
            <div class="form-column">
              <div class="text-input">
                <label for="EmployeeName">Employee Name</label>
                <input type="text" id="EmployeeName" formControlName="EmployeeName" />
              </div>

              <div class="text-input">
                <label for="EmployeeEmail">Email</label>
                <input type="email" id="EmployeeEmail" formControlName="EmployeeEmail" />
              </div>

              <div class="text-input">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" formControlName="phone" />
              </div>
            </div>

            <div class="form-column">
              <div class="text-input">
                <label for="employementType">Employment Type</label>
                <select id="employementType" formControlName="employementType">
                  <option value="Driver">Driver</option>
                  <option value="Admin">Admin</option>
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div class="text-input">
                <label for="DOB">Date of Birth</label>
                <input type="date" id="DOB" formControlName="DOB" />
              </div>

              <div class="text-input">
                <label for="Gender">Gender</label>
                <select id="Gender" formControlName="Gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div class="footer">
            <button class="button-50" type="submit">Register Employee</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `,
  styleUrl: './emp-form.component.css'
})
export class EmpFormComponent {
  @Input() onClose: () => void = () => {};

  empForm: FormGroup = this.fb.group({
    EmployeeName: ['', Validators.required],
    EmployeeEmail: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    employementType: ['Driver', Validators.required],
    DOB: ['', Validators.required],
    Gender: ['Male', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private adminCabService: AdminCabService
  ) {}

  onSubmit() {
    if (this.empForm.valid) {
      const employeeData: Employee = {
        ...this.empForm.value,
        DOB: new Date(this.empForm.value.DOB).toISOString().split('T')[0] // Format date
      };

      this.adminCabService.createEmployee(employeeData)
        .subscribe({
          next: () => {
            this.empForm.reset();
            this.onClose();
          },
          error: (err) => console.error('Error:', err)
        });
    }
  }
}