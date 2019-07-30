import { Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserData } from '../../../@core/data/users';
import { AnalyticsService } from '../../../@core/utils';
import { LayoutService } from '../../../@core/utils';
import { Router } from '@angular/router';
import { AcquisitionService } from '../../services/acquisition.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {

  @Input() position = 'normal';
  user: any;
  ngModelDate = new Date();
  userMenu = [{ title: 'Log Out' }];
  segmentMenu = [{ title: 'Segment 1' }, { title: 'Segment 2' }, { title: 'Segment 3' }]
  accountName = '';


  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private userService: UserData,
    private router: Router,
    private analyticsService: AnalyticsService,
    private layoutService: LayoutService) {
    // this.accountName = JSON.parse(localStorage.getItem('userDetail')).accountName;
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => this.user = users.test);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  onUserDetail() {
    this.router.navigate(['./']);
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
