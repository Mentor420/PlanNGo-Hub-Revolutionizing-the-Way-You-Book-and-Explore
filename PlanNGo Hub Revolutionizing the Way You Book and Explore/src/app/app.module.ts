import { HttpClientModule } from '@angular/common/http';

import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
  ],
  imports: [
    // other modules
    AppComponent,
    MatPaginatorModule,
  ],
  providers: []
})
export class AppModule { }
