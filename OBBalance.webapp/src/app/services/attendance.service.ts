import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: Http, private spinner: NgxSpinnerService) { }

  getCurrentAttendance(): Observable<any[]> {
    this.spinner.show();
    return this.http.get('/api/currentAttendance').pipe(map(res => {
      let ret = res.json();
      this.spinner.hide();
      return ret;
    }));
  }

  getOldAttendance(): Observable<any[]> {
    this.spinner.show();
    return this.http.get('/api/oldAttendance').pipe(map(res => {
      let ret = res.json();
      this.spinner.hide();
      return ret;
    }));
  }
}
