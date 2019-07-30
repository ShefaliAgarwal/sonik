import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbToastrModule,
} from '@nebular/theme';
import { LoginComponent } from './login/login.component';
import { ThemeModule } from '../@theme/theme.module';
import { AuthComponent } from './auth.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbAuthModule,
    ThemeModule,
    NbToastrModule.forRoot(),
  ],
  declarations: [
    LoginComponent,
    AuthComponent,
  ],
})
export class NgxAuthModule {
}