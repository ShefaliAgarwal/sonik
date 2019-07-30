import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-campaign-schedule',
  templateUrl: './campaign-schedule.component.html',
  styleUrls: ['./campaign-schedule.component.scss']
})
export class CampaignScheduleComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit() {
  }
  onSave() {
    this.saveSchedule();
  }

  onBack() {
    this.router.navigate(['/pages/campaigns/campaign-target']);
  }
  saveSchedule() {
    this.router.navigate(['/pages/campaigns']);
  }
  onRepeat() {

  }
  onBlast() {

  }

}
