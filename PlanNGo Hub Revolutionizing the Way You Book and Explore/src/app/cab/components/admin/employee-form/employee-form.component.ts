import { Component,input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule],
  template:`
  <div class="popup-overlay" (click)="onClose()()">
    <div class="popup-content" (click)="$event.stopPropagation()">
<div class="container">
    <div class="h1"><h2>Employee Form</h2></div>
    <form #employeeForm="ngForm" (ngSubmit)="onSubmit(employeeForm)">
      <div class="form-part">
        <div class="form-inputs">
          <div class="text-input">
            <label for="employeName">Employee Name</label>
            <input type="text" id="employeName" name="employeName" ngModel required>
          </div>
          <div class="text-input">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" ngModel required>
          </div>
          <div class="text-input">
            <label for="phone">Phone</label>
            <input type="text" id="phone" name="phone" ngModel required>
          </div>
          <div class="text-input">
            <label for="employmentType">Employment Type</label>
            <select id="employmentType" name="employmentType" ngModel required>
              <option value="" disabled selected>--- Choose Employment type ---</option>
              <option value="Driver">Driver</option>
              <option value="Admin">Admin</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div class="cub-input">
            <div class="text-input">
              <label for="dateOfBirth">Date of Birth</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" ngModel required>
            </div>
            <div class="text-input">
              <label for="gender">Gender</label>
              <input type="text" id="gender" name="gender" ngModel required>
            </div>
          </div>
        </div>
        <div class="footer"><button type="submit" class="button-50">Submit</button></div>
      </div>
    </form>
  </div>
    </div>
</div>
  
`,
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {
  readonly onClose = input.required<() => void>();
  onSubmit(employeeForm: NgForm) {
    if (employeeForm.valid) {
      console.log(employeeForm.value);
    }
  }
}
