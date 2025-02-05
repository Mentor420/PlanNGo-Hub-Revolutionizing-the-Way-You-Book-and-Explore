import { Component ,input} from '@angular/core';

@Component({
  selector: 'app-ctm-form',
  standalone: true,
  imports: [],
  template: `
     <div class="popup-overlay" (click)="onClose()()">
      <div class="popup-content" (click)="$event.stopPropagation()">
        <div class="container">
          <div class="h1"><h2>User form</h2></div>
  <div class="form-part">

    <div class="form-inputs">
      <!--<div class="sqr-input">
        <div class="text-input margin-bottom-zero">
          <div class="sqr-input">
            <div class="text-input">
              <label for="fname">CAB ID</label>
              <input type="text" name="fname" id="fname" >
            </div>
            <div class="text-input">
              <label for="lname">CAB NAME</label>
              <input type="text" name="lnaem" id="lnaem">
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="text-input">
          <label for="phone">DRIVER'S NAME</label>
          <input type="text" name="phone" id="phone">
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="text-input">
        <label for="country">Cab Type</label>
        <select name="country" id="country">
            <option value="0" selected>--- Choose cab type ---</option>
            <option value="1">SUV</option>
            <option value="2">LUXURY</option>
            <option value="3">SEDAN</option>
            <option value="4">VAN</option>
            <option value="3">HATCHBACK</option>
            <option value="4">OLA</option>
        </select>
      </div>-->
      <div class="text-input">
        <label for="address">User Name</label>
        <input type="text" name="address" id="address">
      </div>
      <div class="text-input">
        <label for="email">Email</label>
        <input type="text" name="email" id="email">
      </div>


      <div class="text-input">
        <label for="address">Phone</label>
        <input type="text" name="address" id="address">
      </div>

      <div class="cub-input">
        <div class="text-input">
          <label for="street">Age</label>
          <input type="text" name="street" id="street">
        </div>
        <div class="text-input">
          <label for="postalcode">Gender</label>
          <input type="text" name="postalcode" id="postalcode">
        </div>
        <!--<div class="text-input">
          <label for="city">NAME PLATE</label>
          <input type="text" name="city" id="city">
        </div>-->
        <div class="clearfix"></div>
      </div>


      <!--<div class="radio-button">
        <label>Gender</label>
        <ul>
          <li>
            <input type="radio" name="gender" class="chek" /><span>Male</span>
          </li>
          <li>
            <input type="radio" name="gender" class="chek"/><span>Female</span>
          </li>
        </ul>
      </div>-->
      <!--<div class="sqr-radio-input">
        <div class="radio-button">
          <label>I like</label>
          <ul>
            <li>
              <input type="radio" name="drink" /><span>Cola</span>
            </li>
            <li>
              <input type="radio" name="drink" /><span>Soda</span>
            </li>
          </ul>
        </div>
        <div class="radio-button">
          <label>I Love</label>
          <ul>
            <li>
              <input type="radio" name="drink" /><span>CSS</span>
            </li>
            <li>
              <input type="radio" name="drink" /><span>SCSS</span>
            </li>
          </ul>
        </div>
        <div class="clearfix"></div>
      </div>-->


    </div>
   <div class="footer"><button class="button-50" role="button" (click)="onClose()()">Submit</button></div>
  </div>
</div>
      </div>
    </div>
  `,
  styleUrl: './ctm-form.component.css'
})
export class CtmFormComponent {
   readonly onClose = input.required<() => void>();
}
