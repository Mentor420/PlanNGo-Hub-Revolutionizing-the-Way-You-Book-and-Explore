// rm-table.component.ts (updated)
import { Component, OnInit } from '@angular/core';
import { CabService } from '../../../services/cab.service';
import { CabCardDetails } from '../../../model/cabcard-details';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rm-table',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class=" tw-flex tw-flex-col">
      <div class="tw-flex tw-items-center tw-justify-between tw-p-4">
        <h1 class="tw-text-2xl tw-font-bold tw-text-gray-800">Cab Management</h1>
      </div>

      <div class="tw-overflow-x-auto">
        <table class="tw-min-w-full tw-divide-y tw-divide-gray-200">
          <thead class="tw-bg-gray-50">
          <tr>
            <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Cab
            </th>
            <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Pick-up
            </th>
            <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Drop-off
            </th>
            <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Charges
            </th>
            <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Timing
            </th>
            <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody class="tw-bg-white tw-divide-y tw-divide-gray-200">
          <tr *ngFor="let cab of cabs" class="tw-hover:tw-bg-gray-50">
            <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">{{ cab.rideType }}</td>
            <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">{{ cab.pickupLocation }}</td>
            <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">{{ cab.dropoffLocation }}</td>
            <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">{{ cab.price }}</td>
            <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">{{ cab.time }}</td>
            <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">
              <div class="tw-flex tw-items-center">
                <button
                    (click)="openEditModal(cab)"
                    class="tw-w-4 tw-h-4 tw-mr-2 tw-text-green-200 hover:tw-text-green-900"
                >
                  <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-4m0 0v10m0-10v-4m0 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                  </svg>
                </button>
                <button
                    (click)="deleteCab(cab.id)"
                    class="tw-w-4 tw-h-4 tw-text-red-600 hover:tw-text-red-900"
                >
                  <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit Modal -->
      <div *ngIf="isEditModalOpen"
           class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-p-4 tw-min-h-screen">
        <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-w-full tw-max-w-md">
          <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <h2 class="tw-text-xl tw-font-bold">Edit Cab Details</h2>
            <button
                (click)="closeEditModal()"
                class="tw-text-gray-500 hover:tw-text-gray-700"
            >
              <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form (ngSubmit)="saveCabDetails()">
            <div class="tw-space-y-4">
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Ride Type</label>
                <input
                    type="text"
                    [(ngModel)]="editedCab.rideType"
                    class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                >
              </div>
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Pickup Location</label>
                <input
                    type="text"
                    [(ngModel)]="editedCab.pickupLocation"
                    class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                >
              </div>
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Dropoff Location</label>
                <input
                    type="text"
                    [(ngModel)]="editedCab.dropoffLocation"
                    class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                >
              </div>
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Price</label>
                <input
                    type="number"
                    [(ngModel)]="editedCab.price"
                    class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                >
              </div>
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Time</label>
                <input
                    type="text"
                    [(ngModel)]="editedCab.time"
                    class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                >
              </div>
              <button
                  type="submit"
                  class="tw-w-full tw-bg-blue-600 tw-text-white tw-py-2 tw-px-4 tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrl: './rm-table.component.css',
})
export class RmTableComponent implements OnInit {
  cabs: any;
  isEditModalOpen = false;
  editedCab: CabCardDetails = {} as CabCardDetails;

  constructor(private cabService: CabService) {}

  ngOnInit(): void {
    this.loadCabData();
  }

  async loadCabData() {
    try {
      const cabCardDetails = await this.cabService.getcabCardDetailsList();
      const tempo: any = 'CabCardDetailsList';
      this.cabs = cabCardDetails[tempo];
      console.log(this.cabs);
    } catch (error) {
      console.error('Error loading cab data:', error);
    }
  }

  openEditModal(cab: CabCardDetails) {
    this.editedCab = { ...cab };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  saveCabDetails() {
    this.cabService
        .updateCab(this.editedCab.id, this.editedCab)
        .then(() => {
          console.log('Cab details updated successfully');
          this.closeEditModal();
          this.loadCabData();
        })
        .catch((error) => {
          console.error('Error updating cab', error);
        });
  }

  deleteCab(cabId: string) {
    if (confirm('Are you sure you want to delete this cab?')) {
      this.cabService
          .deleteCab(cabId)
          .then(() => {
            console.log(`Cab with ID: ${cabId} deleted successfully`);
            this.loadCabData();
          })
          .catch((error) => {
            console.error(`Error deleting cab with ID: ${cabId}`, error);
          });
    }
  }
}