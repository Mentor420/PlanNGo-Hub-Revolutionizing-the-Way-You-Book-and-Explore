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
              <img src="../../assets/house-solid.svg" alt="">
              <a routerLink="/" routerLinkActive="active" class="tc" >Home</a>
            </li>
            <li>
              <i class="fa-solid fa-magnifying-glass" style="color: #ffffff; font-size: 20px;"></i>
              <a routerLink="/search" routerLinkActive="active" class="tc" >Search</a>
            </li>
            <li>
              <img src="../../assets/clock-rotate-left-solid.svg" alt="">
              <a  routerLink="/history" routerLinkActive="active">History</a>
            </li>
            <li>
              <img src="../../assets/comment-slash-solid.svg" alt="">
              <a routerLink="/cancellation" routerLinkActive="active">Cancel</a>
              <!-- cab cancelation-->
            </li>
            <li>
              <img src="../../assets/car-side-solid.svg" alt="">
              <a routerLink="/updates" routerLinkActive="active">Update</a>
            </li>
            </ul>
          </nav>
          <div class="divider"></div>
          <nav>
            <ul class="nav-links">
              <li>
                <img src="../../assets/gear-solid.svg" alt="">
                <a href="#">settings</a>
              </li>
            </ul>
            <ul class="nav-links">
              <li>
                <img src="../../assets/helicopter-symbol-solid.svg" alt="">
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
