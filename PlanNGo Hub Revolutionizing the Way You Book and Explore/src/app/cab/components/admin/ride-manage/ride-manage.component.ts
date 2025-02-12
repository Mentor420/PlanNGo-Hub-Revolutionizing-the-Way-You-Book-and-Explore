import { Component } from '@angular/core';
import { RmTableComponent } from '../rm-table/rm-table.component';
import {CabFormComponent} from '../cab-form/cab-form.component';
@Component({
  selector: 'app-ride-manage',
  standalone: true,
  imports: [RmTableComponent,CabFormComponent],
  template: `
  <!-- 
    navbar  
-->

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


  <!-- 
    types of ride 
-->
  <h1 class="tw-ml-64 tw-mt-20 tw-text-4xl tw-text-gray-800 tw-mb-8 tw-text-center tw-py-10">ALL RIDES</h1>
<div class="tw-ml-64 tw-mt-12 tw-flex tw-flex-wrap tw-justify-center">
  
  <div class="tw-ride-types tw-flex tw-flex-wrap tw-justify-center tw-gap-4">
    <div class="tw-ride-type tw-w-64 tw-h-72 tw-bg-white tw-rounded tw-shadow-md tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-4">
      <img class="tw-w-24 tw-h-24 tw-object-cover tw-rounded-full tw-mb-4" src="https://picsum.photos/200/300" alt="suv">
      <h2 class="tw-text-2xl tw-text-gray-800 tw-font-bold">SUV</h2>
      <p class="tw-text-lg tw-text-gray-600 tw-font-normal tw-mb-4">Ideal for group travel, airport transfers, and premium rides.</p>
    </div>
    <div class="tw-ride-type tw-w-64 tw-h-72 tw-bg-white tw-rounded tw-shadow-md tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-4">
      <img class="tw-w-24 tw-h-24 tw-object-cover tw-rounded-full tw-mb-4" src="https://picsum.photos/200/301" alt="luxury">
      <h2 class="tw-text-2xl tw-text-gray-800 tw-font-bold">Luxury</h2>
      <p class="tw-text-lg tw-text-gray-600 tw-font-normal tw-mb-4">High-end service for corporate clients, special occasions</p>
    </div>
    <div class="tw-ride-type tw-w-64 tw-h-72 tw-bg-white tw-rounded tw-shadow-md tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-4">
      <img class="tw-w-24 tw-h-24 tw-object-cover tw-rounded-full tw-mb-4" src="https://picsum.photos/200/302" alt="hatchback">
      <h2 class="tw-text-2xl tw-text-gray-800 tw-font-bold">Hatchback</h2>
      <p class="tw-text-lg tw-text-gray-600 tw-font-normal tw-mb-4">Cost-effective, perfect for short rides and everyday commutes.</p>
    </div>
    <div class="tw-ride-type tw-w-64 tw-h-72 tw-bg-white tw-rounded tw-shadow-md tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-4">
      <img class="tw-w-24 tw-h-24 tw-object-cover tw-rounded-full tw-mb-4" src="https://picsum.photos/200/303" alt="van">
      <h2 class="tw-text-2xl tw-text-gray-800 tw-font-bold">Van</h2>
      <p class="tw-text-lg tw-text-gray-600 tw-font-normal tw-mb-4">Spacious, perfect for carrying lots of people.</p>
    </div>
    <div class="tw-ride-type tw-w-64 tw-h-72 tw-bg-white tw-rounded tw-shadow-md tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-4">
      <img class="tw-w-24 tw-h-24 tw-object-cover tw-rounded-full tw-mb-4" src="https://picsum.photos/200/304" alt="sedan">
      <h2 class="tw-text-2xl tw-text-gray-800 tw-font-bold">Sedan</h2>
      <p class="tw-text-lg tw-text-gray-600 tw-font-normal tw-mb-4">Sleek, comfy, good for families and long drives.</p>
    </div>
    <div class="tw-ride-type tw-w-64 tw-h-72 tw-bg-white tw-rounded tw-shadow-md tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-4">
      <img class="tw-w-24 tw-h-24 tw-object-cover tw-rounded-full tw-mb-4" src="https://picsum.photos/200/305" alt="ola">
      <h2 class="tw-text-2xl tw-text-gray-800 tw-font-bold">Ola</h2>
      <p class="tw-text-lg tw-text-gray-600 tw-font-normal tw-mb-4">Convenient, app-based ride, best for getting around.</p>
    </div>
  </div>
</div>

<!-- table-1 -->
<div class="tw-ml-64 tw-mt-12 tw-table-header tw-flex tw-justify-between tw-items-center tw-py-4 tw-px-6 tw-bg-gray-200 tw-rounded">
  <h1 class="tw-text-3xl tw-text-gray-800 tw-font-bold">All Cabs</h1>
  <button class="tw-button-85 tw-bg-gray-800 tw-text-white tw-no-underline hover:tw-bg-gray-700 tw-p-4 tw-rounded tw-font-bold" role="button" (click)="onaddclick()">ADD CAB</button>
</div>
<app-rm-table></app-rm-table>
@if (isPopupVisible==true)
{<app-cab-form [onClose]="closePopup"></app-cab-form>}
  `,
  styleUrl: './ride-manage.component.css'
})
export class RideManageComponent {
isPopupVisible = false;
onaddclick(){
    this.isPopupVisible=true;
}
closePopup = () => {
  this.isPopupVisible = false;
};
}
