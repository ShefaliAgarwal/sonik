import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from '../@theme/guard/auth.guard';

// import { CampaignComponent } from './acquisition/campaign/campaign.component';



const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'analytics',
      loadChildren: './analysis/analysis.module#AnalysisModule',
    },
    {
      path: 'campaigns',
      loadChildren: './campaign/campaign.module#CampaignModule',
    },
    {
      path: 'admin',
      loadChildren: './admin/admin.module#AdminModule',
    },
    {
      path: 'miscellaneous',
      loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
    },
    {
      path: '',
      redirectTo: 'analytics',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    }],
  // canActivate: [AuthGuard],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}


// {
//   path: mainMenu[0] + '/websites',
//   component: WebsitesComponent,
// },
// {
//   path: mainMenu[0] + '/geo',
//   component: GeoComponent,
// },
// {
//   path: mainMenu[0] + '/overview',
//   component: OverviewComponent,
// },
// {
//   path: mainMenu[0] + '/apps',
//   component: AppsComponent,
// },
// {
//   path: mainMenu[0] + '/on-ground',
//   component: OnGroundComponent,
// },
// {
//   path: mainMenu[0] + '/channel',
//   component: ChannelComponent,
// },
// {
//   path: mainMenu[0] + '/source-medium',
//   component: SourceMediumComponent,
// },
// {
//   path: mainMenu[0] + '/campaign',
//   component: CampaignComponent,
// },
// {
//   path: mainMenu[1] + '/overview',
//   component: EngOverviewComponent,
// },