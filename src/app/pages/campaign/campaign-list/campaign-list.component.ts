import { Component, OnInit } from '@angular/core';
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
      id: {
        title: 'ID',
        type: 'number',
        filter: false
      },
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
