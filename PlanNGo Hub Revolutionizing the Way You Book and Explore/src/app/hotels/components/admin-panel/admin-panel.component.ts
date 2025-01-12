import { Component } from '@angular/core';
import { AdHotelDeatilsComponent } from "./ad-hotel-deatils/ad-hotel-deatils.component";
import { AdSidebarComponent } from "./ad-sidebar/ad-sidebar.component";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [ AdHotelDeatilsComponent, AdSidebarComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

}
