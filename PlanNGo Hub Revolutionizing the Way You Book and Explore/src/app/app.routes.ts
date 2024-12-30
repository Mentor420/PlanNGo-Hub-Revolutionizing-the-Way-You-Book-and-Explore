import { Route } from '@angular/router';
import { PlanNGoComponent } from './hotels/components/planngo/planngo.component';
import { SectionComponent } from './hotels/components/section/section.component';
import { SearchResultsComponent } from './hotels/components/search-results/search-results.component';
import { PageComponent } from './hotels/components/page/page.component';
import { AboutComponent } from './hotels/components/about/about.component';
import { ContactComponent } from './hotels/components/contact/contact.component';
export const routes: Route[] = [
  { path: '', component: SectionComponent },  
  { path: 'planngo', component: PlanNGoComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'page', component: PageComponent }, 
];
