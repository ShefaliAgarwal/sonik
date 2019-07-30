import { NgModule } from '@angular/core';
import { CampaignComponent } from './campaign.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignTargetComponent } from './campaign-target/campaign-target.component';
import { CampaignScheduleComponent } from './campaign-schedule/campaign-schedule.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{
  path: '',
  component: CampaignComponent,
  children: [

    {
      path: 'campaign-list',
      component: CampaignListComponent,
    },
    {
      path: 'new-campaign',
      component: NewCampaignComponent,
    },
    {
      path: 'campaign-target',
      component: CampaignTargetComponent,
    },
    {
      path: 'campaign-schedule',
      component: CampaignScheduleComponent,
    },
    {
      path: '',
      redirectTo: 'campaign-list',
      pathMatch: 'full',
    },
  ],
},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule { }
