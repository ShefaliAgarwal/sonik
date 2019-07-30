import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-campaign-target',
  templateUrl: './campaign-target.component.html',
  styleUrls: ['./campaign-target.component.scss']
})
export class CampaignTargetComponent implements OnInit {

  location = '';
  tones = '';
  content = '';
  constructor(private router: Router) { }

  ngOnInit() {
  }
  onSave() {
    this.saveTarget();
  }
  onNext() {
    this.saveTarget();
    this.router.navigate(['/pages/campaigns/campaign-schedule'])
  }

  onBack() {
    this.router.navigate(['/pages/campaigns/new-campaign']);
  }
  saveTarget() {
  }
}
