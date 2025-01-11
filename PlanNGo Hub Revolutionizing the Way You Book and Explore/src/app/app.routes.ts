import { Routes } from '@angular/router';
import { HomepageComponent } from './cab/components/homepage/homepage.component';
import { CabComponent } from './cab/components/cab/cab.component';
import { HistoryComponent } from './cab/components/history/history.component';
import { UpdatesComponent } from './cab/components/updates/updates.component';
import { CancellationComponent } from './cab/components/cancellation/cancellation.component';
export const routes: Routes = [
         { path: '', component: HomepageComponent },
         { path: 'search', component: CabComponent },
         { path: 'history', component: HistoryComponent },
         { path: 'updates', component: UpdatesComponent },
         { path: 'cancellation', component: CancellationComponent },
         { path: '', component: HomepageComponent},
         { path: '**', redirectTo: '' }
];
