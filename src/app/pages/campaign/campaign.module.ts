import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignComponent } from './campaign.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { CampaignListComponent, CustomRendererComponent } from './campaign-list/campaign-list.component';
import { CampaignTargetComponent } from './campaign-target/campaign-target.component';
import { CampaignScheduleComponent } from './campaign-schedule/campaign-schedule.component';
import { CampaignRoutingModule } from './campaign-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [CampaignComponent, NewCampaignComponent, CampaignListComponent, CampaignTargetComponent, CampaignScheduleComponent,
    CustomRendererComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    CampaignRoutingModule,
    Ng2SmartTableModule
  ],
  entryComponents: [CustomRendererComponent]
})
export class CampaignModule { }
