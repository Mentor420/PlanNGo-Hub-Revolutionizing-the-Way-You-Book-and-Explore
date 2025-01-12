import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ad-sidebar',
  standalone: true,
  imports: [],
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
