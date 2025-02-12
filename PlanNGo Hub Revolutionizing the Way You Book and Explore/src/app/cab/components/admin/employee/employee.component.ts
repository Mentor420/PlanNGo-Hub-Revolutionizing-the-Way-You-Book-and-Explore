import { Component } from '@angular/core';
import { RmTableComponent } from '../rm-table/rm-table.component';
import { EmpFormComponent } from '../emp-form/emp-form.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [RmTableComponent,EmpFormComponent],
  templateUrl: `./employee.component.html`,
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  isPopupVisible = false;
  onaddclick(){
      this.isPopupVisible=true;
  }
  closePopup = () => {
    this.isPopupVisible = false;
  };
}
