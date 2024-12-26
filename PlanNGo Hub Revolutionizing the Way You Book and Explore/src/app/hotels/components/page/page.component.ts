import { Component } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
  

})
export class PageComponent {
  faCoffee = faCoffee;
  faUtensils = faUtensils;
}
