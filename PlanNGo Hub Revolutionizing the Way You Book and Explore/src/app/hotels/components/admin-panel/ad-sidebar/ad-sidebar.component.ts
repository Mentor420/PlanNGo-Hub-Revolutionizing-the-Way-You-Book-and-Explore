import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ad-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ad-sidebar.component.html',
  styleUrls: ['./ad-sidebar.component.css']
})
export class AdSidebarComponent {
  @Input() isOpen = true; // Receives the state from the parent component
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggle() {
    this.toggleSidebar.emit();
  }
}
