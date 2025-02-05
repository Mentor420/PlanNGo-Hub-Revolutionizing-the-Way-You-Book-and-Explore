import { Component } from '@angular/core';
import{CtmDetailsComponent } from '../ctm-details/ctm-details.component';
import{CtmFormComponent} from '../ctm-form/ctm-form.component';
@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CtmDetailsComponent,CtmFormComponent],
  template: `

<!-- navbar -->
<nav class="tw-mt-24 tw-bg-gray-800 tw-text-white tw-shadow-lg">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-4">
    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <!-- Left side - Logo/Brand -->
      <div class="tw-flex tw-items-center">
        <span class="tw-text-xl tw-font-bold">Admin Panel</span>
      </div>
      
      <!-- Right side - Desktop Menu -->
      <div class="tw-hidden tw-md:flex tw-space-x-8">
        <a href="/admin" class="hover:text-gray-300 tw-transition-colors">
          Dashboard
        </a>
        <a href="/ride-manage" class="hover:text-gray-300 tw-transition-colors">
          Rides
        </a>
        <a href="/customer" class="hover:text-gray-300 tw-transition-colors">
          Customers
        </a>
        <a href="/employee" class="hover:text-gray-300 tw-transition-colors">
          Employees
        </a>
      </div>

      <!-- Mobile menu button -->
      <div class="tw-md:hidden">
        <button class="tw-p-2 tw-rounded tw-hover:bg-gray-700" (click)="toggleMobileMenu()">
          <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="tw-md:hidden tw-block" [class]="{ 'tw-hidden': !isMobileMenuOpen }">
      <div class="tw-px-2 tw-pt-2 tw-space-y-1">
        <a href="/admin" class="tw-block tw-px-3 tw-py-2 tw-rounded tw-hover:bg-gray-700">Dashboard</a>
        <a href="/ride-manage" class="tw-block tw-px-3 tw-py-2 tw-rounded tw-hover:bg-gray-700">Rides</a>
        <a href="/customer" class="tw-block tw-px-3 tw-py-2 tw-rounded tw-hover:bg-gray-700">Customers</a>
        <a href="/employee" class="tw-block tw-px-3 tw-py-2 tw-rounded tw-hover:bg-gray-700">Employees</a>
      </div>
    </div>
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

