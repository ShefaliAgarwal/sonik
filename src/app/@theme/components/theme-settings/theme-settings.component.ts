import { Component } from '@angular/core';

import { StateService } from '../../../@core/utils';
import { AcquisitionService } from '../../services/acquisition.service';
import { FilterReqObj, SegmentObj } from '../../model/filter';
import { NbDateService } from '@nebular/theme';

@Component({
  selector: 'ngx-theme-settings',
  styleUrls: ['./theme-settings.component.scss'],
  templateUrl: './theme-setting.component.html',
})
export class ThemeSettingsComponent {

  layouts = [];
  sidebars = [];
  ngModelDate: Date;
  filterReqObj: FilterReqObj;
  segmentList: SegmentObj[] = [];
  segmentListCopy: SegmentObj[] = [];
  selectedSegments = [];
  startDate: any = '';
  endDate: any = '';
  maxDate: Date;
  bsValue: Date[];
  range = '';
  constructor(protected stateService: StateService, private acquisitionService: AcquisitionService,
    protected dateService: NbDateService<Date>) {
    this.maxDate = this.dateService.today();
    // this.ngModelDate = this.dateService.today();
    this.filterReqObj = new FilterReqObj();
    this.filterReqObj.name = 'segment';
    this.stateService.getLayoutStates()
      .subscribe((layouts: any[]) => this.layouts = layouts);

    this.stateService.getSidebarStates()
      .subscribe((sidebars: any[]) => this.sidebars = sidebars);
    this.getSegment();
  }

  getSegment() {
    this.acquisitionService.getFilterData(this.filterReqObj).subscribe(data => {
      if (data) {
        this.segmentList = [];
        this.segmentList = data.data.segment;
        this.segmentListCopy = [...this.segmentList];
        console.log(data);
      }
    });
  }

  layoutSelect(layout: any): boolean {
    this.layouts = this.layouts.map((l: any) => {
      l.selected = false;
      return l;
    });

    layout.selected = true;
    this.stateService.setLayoutState(layout);
    return false;
  }

  sidebarSelect(sidebars: any): boolean {
    this.sidebars = this.sidebars.map((s: any) => {
      s.selected = false;
      return s;
    });

    sidebars.selected = true;
    this.stateService.setSidebarState(sidebars);
    return false;
  }
  // onDateChange(event) {
  //   console.log('event', event);
  //   if (event.start && event.end) {
  //     this.startDate = (Math.round(Math.floor(event.start.getTime()) / 1000));
  //     this.endDate = (Math.round(Math.floor(event.end.getTime()) / 1000));
  //   }
  // }
  onChange(event) {
    if (event === '') {
      this.startDate = '';
      this.endDate = '';
    }
  }
  // onCheckbox(event) {
  //   let flag = false;
  //   if (this.selectedSegments.indexOf(event) == -1) {
  //     this.selectedSegments.push(event);
  //     flag = true;
  //   }
  //   else if (!flag && this.selectedSegments.indexOf(event) > -1) {
  //     this.selectedSegments.splice(this.selectedSegments.indexOf(event), 1);
  //   }
  // }
  // onApplyFilter() {
  //   this.acquisitionService.filter.next({ segment: this.selectedSegments, start_date: this.startDate, end_date: this.endDate });
  // }
  // onResetFilter() {
  //   this.range = '';
  //   this.ngModelDate = this.dateService.today();
  //   this.selectedSegments = [];
  //   this.getSegment();
  //   this.acquisitionService.filter.next('');
  // }
}
