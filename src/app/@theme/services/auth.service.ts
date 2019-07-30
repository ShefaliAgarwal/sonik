import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/Rx';

@Injectable()
export class AuthService {
  constructor(private _api: ApiService) { }

  login(body) {
    return this.onlogin(body)
      .map((result) => {
        if (result) {
          localStorage.setItem('isLogged', 'true');
          localStorage.setItem('currentUserToken', result.token);
          localStorage.setItem('userDetail', JSON.stringify(result.details));
        }
        return result;
      }).catch((error: any) => Observable.throw(error || 'Server error'));
  }

  logout() {
    return this.onlogout()
      .map((result) => {
        if (result) {
          localStorage.removeItem('isLogged');
          localStorage.removeItem('currentUserToken');
          localStorage.removeItem('userDetail');
        }
        return result;
      }).catch((error: any) => Observable.throw(error || 'Server error'));


  }

  onlogout() {
    return this._api.apiCaller('delete', '/v0/logout');
  }

  onlogin(data: any): Observable<any> {
    return this._api.apiCaller('post', '/v0/login', data);
  }
}
