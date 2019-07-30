import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss']
})
export class NewCampaignComponent implements OnInit {

  campaignName = '';
  notificationText = '';
  notificationTitle = '';
  constructor(private router: Router) { }

  ngOnInit() {
  }
  onSave() {
    this.saveCampaign();
  }
  onNext() {
    this.saveCampaign();
    this.router.navigate(['/pages/campaigns/campaign-target'])
  }

  onBack() {
    this.router.navigate(['/pages/campaigns']);
  }
  saveCampaign() {
  }
}
