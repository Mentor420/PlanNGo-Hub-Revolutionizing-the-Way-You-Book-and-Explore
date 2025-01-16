import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./hotels/components/header/header.component";
import { FooterComponent } from "./hotels/components/footer/footer.component";
import { SectionComponent } from "./hotels/components/section/section.component";
import { PageComponent } from "./hotels/components/page/page.component";
import { LocationComponent } from './hotels/components/location/location.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, SectionComponent, PageComponent, LocationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngularProject';
  showHeaderAndFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // List of admin routes where header and footer should be hidden
      const adminRoutes = ['/admin-panel', '/ad-hotel-deatils', '/ad-room-details'];
      this.showHeaderAndFooter = !adminRoutes.some(route =>
        this.router.url.startsWith(route)
      );
    });
  }
}
