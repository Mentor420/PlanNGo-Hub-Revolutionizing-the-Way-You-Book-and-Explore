import { Component } from '@angular/core';
import{CtmDetailsComponent } from '../ctm-details/ctm-details.component';
import{CtmFormComponent} from '../ctm-form/ctm-form.component';
@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CtmDetailsComponent,CtmFormComponent],
  template: `

<!-- navbar -->
<nav class="tw-bg-white tw-shadow-lg tw-fixed tw-left-0 tw-top-0 tw-bottom-0 tw-w-64 tw-z-50">
  <div class="tw-flex tw-flex-col tw-h-full">
    <!-- Logo -->
    <div class="tw-p-4 tw-bg-gray-100">
      <span class="tw-text-2xl tw-font-bold tw-text-blue-600">AdminPanel</span>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="tw-flex-1 tw-overflow-y-auto">
      <div class="tw-flex tw-flex-col tw-pt-4 tw-space-y-2">
        <a href="/admin" class="tw-flex tw-items-center tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-text-blue-600 hover:tw-bg-gray-100 tw-transition-colors tw-duration-200">
          <svg class="tw-w-5 tw-h-5 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Dashboard
        </a>
        
        <a href="/ride-manage" class="tw-flex tw-items-center tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-text-blue-600 hover:tw-bg-gray-100 tw-transition-colors tw-duration-200">
          <svg class="tw-w-5 tw-h-5 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Rides
        </a>
        
        <a href="/customer" class="tw-flex tw-items-center tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-text-blue-600 hover:tw-bg-gray-100 tw-transition-colors tw-duration-200">
          <svg class="tw-w-5 tw-h-5 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Customers
        </a>
        
        <a href="/employee" class="tw-flex tw-items-center tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-text-blue-600 hover:tw-bg-gray-100 tw-transition-colors tw-duration-200">
          <svg class="tw-w-5 tw-h-5 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Employees
        </a>
        
      </div>
    </nav>
  </div>
</nav>

<!-- header -->
<div class="tw-max-w-7xl tw-mx-auto tw-px-4 tw-pt-8">
  <div class="tw-flex tw-justify-end tw-py-4">
        <button 
      class="tw-px-6 tw-py-2.5 tw-bg-blue-600 hover:tw-bg-blue-700 tw-rounded-full tw-border-none tw-cursor-pointer tw-shadow-lg tw-transition-colors tw-duration-300"
      role="button"
      (click)="onaddclick()"
    >
      <div class="tw-flex tw-items-center tw-gap-2">
        <svg class="tw-w-5 tw-h-5 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Add User</span>
      </div>
    </button>
  </div>

  <!-- cards -->
  
  <div class="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-lg:grid-cols-3 tw-gap-8 tw-p-8">
        <app-ctm-details 
      class="tw-bg-white tw-rounded-lg tw-shadow tw-p-6 tw-hover:tw-shadow-lg tw-transition-shadow"
    ></app-ctm-details>
    <!-- Add more customer cards as needed -->
  </div>
</div>
  `,
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  isPopupVisible = false;
  isMobileMenuOpen = false;
  
  onaddclick() {
    this.isPopupVisible = true;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closePopup = () => {
    this.isPopupVisible = false;
  };
}

