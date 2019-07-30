import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { AcquisitionModule } from './acquisition/acquisition.module';
import { SharedModule } from '../shared.module';

// import { on } from './acquisition/on-ground/on-ground.component';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    SharedModule,
    AcquisitionModule,
    MiscellaneousModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    // OnGroundComponent,
  ],
  providers: [],
})
export class PagesModule {
}
