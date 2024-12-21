import { Component } from '@angular/core';
import {SearchBarComponent} from '../search-bar/search-bar.component';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [SearchBarComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent {

}
