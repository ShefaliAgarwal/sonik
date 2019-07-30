import { Component, Input } from '@angular/core';
import { text } from '@angular/core/src/render3';
// class="text-white card-color"
@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
  <nb-card>
    
      
   
      <nb-card-body>
     <div class="title"> {{title}}</div>
        <div class="info">
         <div *ngIf="percentage>=0" class="icon">
           <i class="nb-arrow-thin-up up" [nbPopover]="icon"></i>
           <span class="up" *ngIf="percentage != null">{{percentage}}</span><span *ngIf="percentage == null">0</span> %
           <span class="text">{{text}}</span> 
          </div>
          <div *ngIf="percentage<0" class="icon">
            <i class="nb-arrow-thin-down down" [nbPopover]="icon"></i>
          <span class="down" *ngIf="percentage != null">{{percentage}}</span><span *ngIf="percentage == null">0</span> % 
          <span class="text">{{text}}</span>
          </div>
          
          <div class="value">{{count}}</div>
        </div>
      </nb-card-body>
    </nb-card>
  `,
})

export class StatusCardComponent {

  @Input() title: string;
  @Input() count: string;
  @Input() percentage;
  @Input() text;
}
