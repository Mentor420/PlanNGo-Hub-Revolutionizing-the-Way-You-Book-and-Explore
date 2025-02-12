
import { Component, OnInit } from '@angular/core';
import { RmTableComponent } from '../rm-table/rm-table.component';
import { AdminCabService } from '../../../services/admin-cab.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RmTableComponent, CommonModule],
  template: `
    <div class="tw-min-h-screen tw-bg-gray-50">
  <!-- Navbar -->
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

  <!-- Main Content -->
  <main class="tw-mt-24 tw-max-w-7xl tw-mx-auto tw-px-4 tw-py-8">
    <!-- Quick Stats Cards -->
    <div class="tw-grid tw-grid-cols-4 tw-md:grid-cols-2 tw-lg:grid-cols-4 tw-gap-6 tw-mb-8">
      <!-- Customers Card -->
      <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg hover:tw-shadow-xl tw-transition-shadow tw-duration-200 tw-transform hover:tw-scale-105">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
            <h2 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-2">78</h2>
            <p class="tw-text-gray-500 tw-text-sm">Total Customers</p>
          </div>
          <div class="bg-gradient-to-r from-blue-100 to-blue-200 tw-p-3 tw-rounded-lg">
            <span class="tw-text-blue-600 tw-text-2xl">👥</span>
          </div>
        </div>
        <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-gradient-to-t from-blue-50 to-transparent tw-h-8 tw-opacity-50"></div>
      </div>

      <!-- Available Cabs Card -->
      <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg hover:tw-shadow-xl tw-transition-shadow tw-duration-200 tw-transform hover:tw-scale-105">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
            <h2 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-2">{{ totalCabs }}</h2>
            <p class="tw-text-gray-500 tw-text-sm">Available Cabs</p>
          </div>
          <div class="bg-gradient-to-r from-blue-100 to-blue-200 tw-p-3 tw-rounded-lg">
            <span class="tw-text-blue-600 tw-text-2xl">🚕</span>
          </div>
        </div>
        <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-gradient-to-t from-blue-50 to-transparent tw-h-8 tw-opacity-50"></div>
      </div>

      <!-- Earnings Card -->
      <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg hover:tw-shadow-xl tw-transition-shadow tw-duration-200 tw-transform hover:tw-scale-105">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
            <h2 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-2">$100,000</h2>
            <p class="tw-text-gray-500 tw-text-sm">Total Earnings</p>
          </div>
          <div class="bg-gradient-to-r from-green-100 to-green-200 tw-p-3 tw-rounded-lg">
            <span class="tw-text-green-600 tw-text-2xl">💰</span>
          </div>
        </div>
        <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-gradient-to-t from-green-50 to-transparent tw-h-8 tw-opacity-50"></div>
      </div>

      <!-- Employees Card -->
      <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg hover:tw-shadow-xl tw-transition-shadow tw-duration-200 tw-transform hover:tw-scale-105">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
            <h2 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-2">{{ totalEmployees }}</h2>
            <p class="tw-text-gray-500 tw-text-sm">Total Employees</p>
          </div>
          <div class="bg-gradient-to-r from-blue-100 to-blue-200 tw-p-3 tw-rounded-lg">
            <span class="tw-text-blue-600 tw-text-2xl">👔</span>
          </div>
        </div>
        <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-gradient-to-t from-blue-50 to-transparent tw-h-8 tw-opacity-50"></div>
      </div>
    </div>

    <!-- Recent Bookings Table -->
    <div class="tw-max-w-6xl tw-mx-auto tw-bg-white tw-rounded-xl tw-shadow-lg tw-p-6">
      <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
        <div>
          <h2 class="tw-text-2xl tw-font-bold tw-text-gray-800">Recent Bookings</h2>
          <p class="tw-text-gray-500 tw-text-sm">Latest cab booking activities</p>
        </div>
      </div>
      <app-rm-table></app-rm-table>
    </div>
  </main>
</div>
    
  `,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalCabs: number = 0;
  totalEmployees: number = 0;

  constructor(private adminService: AdminCabService) {}

  ngOnInit() {
    this.loadCounts();
  }


  private loadCounts() {
    // Get total cabs
    this.adminService.getCabCount().subscribe( (data) => {

        const findata=data;
        const anys:any='CabCardDetailsList'
        const tolData:any=findata[anys];

        this.totalCabs = tolData.length;
        console.log(tolData);

    });

    // Get total employees
    this.adminService.getEmployeeCount().subscribe((data) =>{
      const empdata=data;
      const newD:any='cabEmployee'
      const newData:any=empdata[newD];
      this.totalEmployees = newData.length;


    });
  }
}
