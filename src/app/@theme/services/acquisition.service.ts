import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AcquisitionService {

  dateRange: BehaviorSubject<any> = new BehaviorSubject<any>('');
  showSwitchFlag: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  filter: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(private _api: ApiService) {
  }

  // setDate(date) {
  //   this.dateRange.next({ start_date: date.start_date, end_date: date.end_date });
  // }

  getUsersCount(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/users/count', this._api.getParams(reqObj));
  }

  getLeadsCount(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/leads/count', this._api.getParams(reqObj));
  }

  getCustomersCount(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/customers/count', this._api.getParams(reqObj));
  }

  getCustomersRate(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/customers/rate', this._api.getParams(reqObj));
  }

  getLeadsRate(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/leads/rate', this._api.getParams(reqObj));
  }

  getBarChartData(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/charts/bar', this._api.getBarChartParams(reqObj));
  }

  getLineChartData(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/charts/line', this._api.getLineChartParams(reqObj));
  }

  getTableData(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/tables/', this._api.getTableParams(reqObj));
  }

  getMapData(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/charts/geo', this._api.getMapParams(reqObj));
  }
  getFilterData(reqObj): Observable<any> {
    return this._api.apiCaller('get', '/v0/filters', this._api.setFilterParams(reqObj));
  }
}
