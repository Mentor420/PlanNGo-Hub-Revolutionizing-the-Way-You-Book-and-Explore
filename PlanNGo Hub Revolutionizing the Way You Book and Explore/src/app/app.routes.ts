import { Route } from '@angular/router';
import { PlanNGoComponent } from './hotels/components/planngo/planngo.component';
import { SectionComponent } from './hotels/components/section/section.component';
import { SearchResultsComponent } from './hotels/components/search-results/search-results.component';
import { PageComponent } from './hotels/components/page/page.component';

export const routes: Route[] = [
  { path: '', component: SectionComponent },  
  { path: 'planngo', component: PlanNGoComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'page', component: PageComponent }, 
];
