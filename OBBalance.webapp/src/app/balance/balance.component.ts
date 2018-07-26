import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../services/balance.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  public balance: Observable<any[]>;

  constructor(private balanceService: BalanceService, private activeRoute:ActivatedRoute) {
    this.activeRoute.paramMap.subscribe((map) => { 
      var flag = map.get("flag");

      if (flag === "old") {
        this.balance = this.balanceService.getOldBalance();
      } else {
        this.balance = this.balanceService.getCurrentBalance();
      }
    });
  }

  ngOnInit() {
  }

}
