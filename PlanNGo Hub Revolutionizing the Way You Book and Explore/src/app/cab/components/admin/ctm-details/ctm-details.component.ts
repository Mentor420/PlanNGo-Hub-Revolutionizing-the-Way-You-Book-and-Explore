import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../model/employee';
import { AdminCabService } from '../../../services/admin-cab.service';
import { FormsModule } from '@angular/forms';
import { CommonModule,  } from '@angular/common';

@Component({
  selector: 'app-ctm-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <!-- Container -->
<div class="tw-container tw-mx-auto tw-p-4 tw-md:tw-p-6 tw-lg:tw-p-8">
  <!-- Card Grid -->
  <div class="tw-grid tw-grid-cols-1 tw-gap-4 tw-md:tw-grid-cols-2 tw-lg:tw-grid-cols-3">
    <div class="tw-card tw-bg-white tw-shadow-md tw-rounded-lg" *ngFor="let employee of paginatedEmployees">
      <!-- Image -->
      <img
        [src]="employee.Gender === 'Female'?'https://img.freepik.com/free-vector/young-woman-white_25030-39527.jpg?ga=GA1.1.1791716734.1735568001&semt=ais_hybrid':'../../../../../assets/images/Young_man.jpg'"
        alt="Person"
        class="tw-w-full tw-h-48 tw-object-cover tw-rounded-t-lg"
      />
      <!-- Details -->
      <div class="tw-p-4">
        <h2 class="tw-text-lg tw-font-bold tw-mb-2">{{ employee.EmployeeName }}</h2>
        <p class="tw-text-gray-600 tw-mb-2">{{ employee.EmployeeEmail }}</p>
        <p class="tw-text-gray-600 tw-mb-2">{{ employee.phone }}</p>
        <!-- Age and Gender -->
        <div class="tw-flex tw-justify-between tw-mb-2">
          <p class="tw-text-gray-600">{{ getAge(employee.DOB) }} y/o</p>
          <p class="tw-text-gray-600">{{ employee.Gender }}</p>
        </div>
        <!-- Buttons -->
        <div class="tw-flex tw-justify-between">
          <button class="tw-bg-blue-500 tw-hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded" (click)="openEditModal(employee)">
            Edit
          </button>
          <button class="tw-bg-red-500 tw-hover:tw-bg-red-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded" (click)="deleteEmployee(employee.id)">
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Pagination Controls -->
  <div class="tw-pagination-container tw-mt-4">
    <div class="tw-pagination-controls tw-flex tw-justify-between">
      <button 
        class="tw-pagination-button tw-bg-gray-200 tw-hover:tw-bg-gray-300 tw-text-gray-600 tw-py-2 tw-px-4 tw-rounded-l-lg" 
        [class.disabled]="currentPage === 1"
        (click)="changePage(currentPage - 1)" 
        [disabled]="currentPage === 1"
      >
        ←
      </button>
      <div class="tw-page-numbers tw-flex">
        <button 
          class="tw-page-number tw-bg-gray-200 tw-hover:tw-bg-gray-300 tw-text-gray-600 tw-py-2 tw-px-4" 
          [class.active]="pageNum === currentPage"
          (click)="changePage(pageNum)"
          *ngFor="let pageNum of getPageNumbers(); let i = index"
        >
          {{ pageNum }}
        </button>
      </div>
      <button 
        class="tw-pagination-button tw-bg-gray-200 tw-hover:tw-bg-gray-300 tw-text-gray-600 tw-py-2 tw-px-4 tw-rounded-r-lg" 
        [class.disabled]="currentPage === totalPages"
        (click)="changePage(currentPage + 1)" 
        [disabled]="currentPage === totalPages"
      >
        →
      </button>
    </div>
    <div class="tw-page-info tw-mt-2 tw-text-gray-600">
      Page {{ currentPage }} of {{ totalPages }}
    </div>
  </div>
  <!-- Edit Modal -->
  <div *ngIf="isEditModalOpen" class="tw-modal tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-bg-black tw-bg-opacity-50 tw-flex tw-justify-center tw-items-center">
    <div class="tw-modal-content tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4 tw-w-1/2">
      <span class="tw-close tw-absolute tw-top-4 tw-right-4 tw-text-gray-600 tw-hover:tw-text-gray-900 tw-cursor-pointer" (click)="closeEditModal()">&times;</span>
      <h2 class="tw-text-lg tw-font-bold tw-mb-2">Edit Employee Details</h2>
      <form (ngSubmit)="saveEmployeeDetails()">
        <!-- Employee Name -->
        <div class="tw-form-group tw-mb-4">
          <label for="EmployeeName" class="tw-block tw-text-gray-600 tw-mb-2">Employee Name:</label>
          <input
            type="text"
            id="EmployeeName"
            name="EmployeeName"
            [(ngModel)]="editedEmployee.EmployeeName"
            required
            class="tw-block tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg"
          />
        </div>
        <!-- Employee Email -->
        <div class="tw-form-group tw-mb-4">
          <label for="EmployeeEmail" class="tw-block tw-text-gray-600 tw-mb-2">Employee Email:</label>
          <input
            type="email"
            id="EmployeeEmail"
            name="EmployeeEmail"
            [(ngModel)]="editedEmployee.EmployeeEmail"
            required
            class="tw-block tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg"
          />
        </div>
        <!-- Phone -->
        <div class="tw-form-group tw-mb-4">
          <label for="phone" class="tw-block tw-text-gray-600 tw-mb-2">Phone:</label>
          <input
            type="number"
            id="phone"
            name="phone"
            [(ngModel)]="editedEmployee.phone"
            required
            class="tw-block tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg"
          />
        </div>
        <!-- Employment Type -->
        <div class="tw-form-group tw-mb-4">
          <label for="employementType" class="tw-block tw-text-gray-600 tw-mb-2">Employment Type:</label>
          <input
            type="text"
            id="employementType"
            name="employementType"
            [(ngModel)]="editedEmployee.employementType"
            required
            class="tw-block tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg"
          />
        </div>
        <!-- Date of Birth -->
        <div class="tw-form-group tw-mb-4">
          <label for="DOB" class="tw-block tw-text-gray-600 tw-mb-2">Date of Birth:</label>
          <input
            type="text"
            id="DOB"
            name="DOB"
            [(ngModel)]="editedEmployee.DOB"
            required
            class="tw-block tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg"
          />
        </div>
        <!-- Gender -->
        <div class="tw-form-group tw-mb-4">
          <label for="Gender" class="tw-block tw-text-gray-600 tw-mb-2">Gender:</label>
          <input
            type="text"
            id="Gender"
            name="Gender"
            [(ngModel)]="editedEmployee.Gender"
            required
            class="tw-block tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg"
          />
        </div>
        <!-- Save Button -->
        <button type="submit" class="tw-bg-blue-500 tw-hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded-lg tw-w-full">
          Save
        </button>
      </form>
    </div>
  </div>
  `,
  styleUrl: './ctm-details.component.css',
})
export class CtmDetailsComponent implements OnInit {
  employees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  currentPage = 1;
  pageSize = 4;
  totalPages = 1;
  isEditModalOpen = false;
  editedEmployee: Employee = {} as Employee;

  constructor(private adminCabService: AdminCabService) {}

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
  this.adminCabService.getEmployeeList().subscribe((response: any) => {
    const employees = response['cabEmployee'];
    this.employees = employees;
    this.totalPages = Math.ceil(employees.length / this.pageSize);
    this.updatePaginatedEmployees();
  });
}

  updatePaginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmployees = this.employees.slice(startIndex, endIndex);
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedEmployees();
    }
  }
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  openEditModal(employee: Employee) {
    this.editedEmployee = { ...employee };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  saveEmployeeDetails() {
    this.adminCabService
      .updateEmployee(this.editedEmployee.id, this.editedEmployee)
      .then(() => {
        console.log('Employee details updated successfully');
        this.closeEditModal();
        this.loadEmployeeData();
      })
      .catch((error) => console.error('Error updating employee', error));
  }

  deleteEmployee(employeeId: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.adminCabService
        .deleteEmployee(employeeId)
        .then(() => {
          console.log(`Employee with ID: ${employeeId} deleted successfully`);
          this.loadEmployeeData();
        })
        .catch((error) => {
          console.error(
            `Error deleting employee with ID: ${employeeId}`,
            error
          );
        });
    }
  }
  getAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
