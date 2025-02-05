import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  template: `
 <aside class="sidebar">
      <div class="sidebar-comp">


        <nav>
          <ul class="nav-links">
            <li>
            <i class="fa-solid fa-house" style="color: #ffffff; font-size: 20px;"></i>
              <a routerLink="/" routerLinkActive="active" class="tc" >Home</a>
            </li>
            <li>
              <i class="fa-solid fa-magnifying-glass" style="color: #ffffff; font-size: 20px;"></i>
              <a routerLink="/search" routerLinkActive="active" class="tc" >Search</a>
            </li>
            <li>
            <i class="fa-solid fa-clock-rotate-left" style="color: #FFFFFF; font-size: 20px;"></i>
              <a  routerLink="/history" routerLinkActive="active">History</a>
            </li>
            <li>
            <i class="fa-solid fa-comment-slash" style="color: #FFFFFF; font-size: 20px;"></i>
              <a routerLink="/cancellation" routerLinkActive="active">Cancel</a>
              <!-- cab cancelation-->
            </li>
            <li>
            <i class="fa-solid fa-car-side" style="color: #FFFFFF; font-size: 20px;"></i>
              <a routerLink="/updates" routerLinkActive="active">Update</a>
            </li>
            </ul>
          </nav>
          <div class="divider"></div>
          <nav>
            <ul class="nav-links">
              <li>
              <i class="fa-solid fa-gear" style="color: #FFFFFF; font-size: 20px;"></i>
                <a href="#">settings</a>
              </li>
            </ul>
            <ul class="nav-links">
              <li>
              <i class="fa-solid fa-helicopter-symbol" style="color: #FFFFFF; font-size: 20px;"></i>
                <a href="#">Help</a>
              </li>
            </ul>
          </nav>
        </div>


    </aside>
  `,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
