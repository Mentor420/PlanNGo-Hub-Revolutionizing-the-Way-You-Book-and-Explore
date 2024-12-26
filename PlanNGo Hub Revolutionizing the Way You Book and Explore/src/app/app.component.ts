import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./hotels/components/header/header.component";
import { FooterComponent } from "./hotels/components/footer/footer.component";
import { SectionComponent } from "./hotels/components/section/section.component";
import { PageComponent } from "./hotels/components/page/page.component";
import { LocationComponent } from './hotels/components/location/location.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SectionComponent, PageComponent, LocationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngularProject';
}
