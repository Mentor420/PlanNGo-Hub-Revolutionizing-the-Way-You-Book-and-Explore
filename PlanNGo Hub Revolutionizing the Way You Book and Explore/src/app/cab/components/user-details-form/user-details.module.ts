import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDetailsFormComponent } from './user-details-form.component';

@NgModule({
  declarations: [UserDetailsFormComponent],
  imports: [CommonModule, FormsModule],
  exports: [UserDetailsFormComponent]
})
export class UserDetailsFormModule {}