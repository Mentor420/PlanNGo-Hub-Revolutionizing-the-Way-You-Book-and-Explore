import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [SearchBarComponent],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent {
  constructor(private router: Router) {}

  navigateToLocation(city: string): void {
    this.router.navigate(['/location'], { queryParams: { city } });
  }
}
