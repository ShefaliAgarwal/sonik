import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcquisitionRoutingModule } from './acquisition-routing.module';
import { AcquisitionComponent } from './acquisition.component';
import { OverviewComponent } from './overview/overview.component';
import { WebsitesComponent } from './websites/websites.component';
import { GeoComponent } from './geo/geo.component';
import { CampaignComponent } from './campaign/campaign.component';
import { OnGroundComponent } from './on-ground/on-ground.component';
import { SourceMediumComponent } from './source-medium/source-medium.component';
import { SharedModule } from '../../shared.module';
import { StatusCardComponent } from '../../@theme/components/status-card/status-card.component';
import { ThemeModule } from '../../@theme/theme.module';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    AcquisitionComponent,
    OverviewComponent,
    WebsitesComponent,
    GeoComponent,
    CampaignComponent,
    OnGroundComponent,
    SourceMediumComponent,
    // StatusCardComponent,
  ],
  imports: [
    AcquisitionRoutingModule,
    SharedModule,
    ThemeModule,
    NgxEchartsModule,
    LeafletModule,
    HttpClientModule,
    Ng2SmartTableModule,
  ],
})
export class AcquisitionModule { }
