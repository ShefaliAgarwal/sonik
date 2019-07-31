import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';

@Component({
  selector: 'ngx-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {

  searchText = '';
  settings = {
    actions: false,
    columns: {
      campaignName: {
        title: 'Campaign Name',
        type: 'string',
        filter: false
      },
      status: {
        title: 'Status',
        type: 'string',
        filter: false
      },
      openRate: {
        title: 'Open Rate',
        type: 'string',
        filter: false
      },
      lastUpdated: {
        title: 'Last Updated',
        type: 'string',
        filter: false
      },
      id: {
        title: 'Actions',
        type: 'custom',
        renderComponent: CustomRendererComponent,
        filter: false
      },
    },
    pager: {
      display: true,
      perPage: 10
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router, private service: SmartTableData) { }

  ngOnInit() {
    const data = this.service.getData();
    this.source.load(data);
  }
  onAddNew() {
    this.router.navigate(['/pages/campaigns/new-campaign']);
  }
}
@Component({
  selector: 'app-custom-renderer',
  template: `<span class="font-medium-1 mr-2" style="cursor:pointer;color:red" (click)="editRecord()">EDIT</span>
  <i class="fa fa-trash font-medium-1 mr-2" style="cursor:pointer;color:red" (click)="onDeleteRecord()"></i>`
})
export class CustomRendererComponent implements OnInit {

  constructor(private router: Router) { }
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  ngOnInit() {

  }

  editRecord() {
    this.router.navigate(['/pages/campaigns/new-campaign']);
  }
  onDeleteRecord() {

  }
}