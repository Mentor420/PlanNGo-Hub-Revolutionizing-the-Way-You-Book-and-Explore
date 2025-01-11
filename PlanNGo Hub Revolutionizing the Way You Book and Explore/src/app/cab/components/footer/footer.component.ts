import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div>
            <img src="assets/logo.svg" alt="Company Logo" class="logo" />
          </div>
          <div>
            <h3 class="section-title">More</h3>
            <ul class="section-list">
              <li>Terms and Conditions</li>
              <li>Privacy Policy</li>
              <li>Help Center</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 class="section-title">Quick Links</h3>
            <ul class="section-list">
              <li>About Us</li>
              <li>Support</li>
              <li>Licenses</li>
              <li>Testimonial</li>
              <li>Blog</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>2024 © PlanNGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
