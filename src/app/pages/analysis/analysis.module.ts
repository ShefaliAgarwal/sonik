import { NgModule } from '@angular/core';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { AnalysisComponent } from './analysis.component';
import { SharedModule } from '../../shared.module';
import { ThemeModule } from '../../@theme/theme.module';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    AnalysisComponent,
  ],
  imports: [
    AnalysisRoutingModule,
    SharedModule,
    ThemeModule,
    NgxEchartsModule,
    LeafletModule,
    HttpClientModule,
    Ng2SmartTableModule,
  ],
})
export class AnalysisModule { }
