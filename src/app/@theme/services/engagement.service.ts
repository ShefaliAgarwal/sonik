import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {

  constructor(private _api: ApiService) {
  }

  getCardCount(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/engagement/count', this._api.getParams(reqObj));
  }
  getBarChart(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/engagement/charts/bar', this._api.getParams(reqObj));
  }
  getPieChart(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/engagement/charts/pie', this._api.getParams(reqObj));
  }
  getTable(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/engagement/table', this._api.getParams(reqObj));
  }
}
