import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(private http: Http) { }

  get(): Observable<any[]> {
    return this.http.get('/api/balance').pipe(map(res => res.json()));
  }
}
