/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { NbMenuService } from '@nebular/theme/components/menu/menu.service';
import { AuthService } from './@theme/services/auth.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AcquisitionService } from './@theme/services/acquisition.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private menuService: NbMenuService,
    private aquisitionService:AcquisitionService,
    private authService: AuthService, private router: Router, private toaster: NbToastrService) {
    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }


  onContecxtItemSelection(title) {
    if (title === 'Log Out') {
      this.authService.logout().subscribe(data => {
        if (data) {
          this.toaster.success(data.message);
          this.router.navigate(['/auth']);
        } else {
          this.toaster.warning(data.message);
        }
      }, error => {
        this.toaster.danger(error);
      });
    }
  }
}
