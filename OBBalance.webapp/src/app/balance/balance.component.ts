import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../services/balance.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  public balance: Observable<any[]>;

  constructor(private balanceService: BalanceService) {

  }

  ngOnInit() {
    this.balance = this.balanceService.get();
  }

}
