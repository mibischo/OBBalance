import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(private http: Http, private spinner: NgxSpinnerService) { }

  getCurrentBalance(): Observable<any[]> {
    this.spinner.show();
    return this.http.get('/api/balance/current').pipe(map(res => {
      let ret = res.json();
      this.spinner.hide();
      return ret;
    }));
  }

  getOldBalance(): Observable<any[]> {
    this.spinner.show();
    return this.http.get('/api/balance/old').pipe(map(res => {
      let ret = res.json();
      this.spinner.hide();
      return ret;
    }));
  }
}
