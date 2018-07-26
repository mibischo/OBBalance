import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material';

@Component({
  selector: 'app-balance-table',
  templateUrl: './balance-table.component.html',
  styleUrls: ['./balance-table.component.css']
})
export class BalanceTableComponent implements OnInit {

  @Input('dataSource') set dataSource(value: any[]) {
    if (value) {
      this._dataSource = new MatTableDataSource(value);
      this.data = value;
      // this._dataSource.sort = this.sort;
      // console.log(value);
    }
  };

  data: any[];
  _dataSource = new MatTableDataSource([]);
  displayedColumns = ['name', 'balance', 'paid', 'owed', 'extra', 'info'];

  constructor() { }

  ngOnInit() {
  }

  search(value) {
    let filtered = this.data.filter(p => p.name.toLowerCase().startsWith(value.toLowerCase()));
    this._dataSource = new MatTableDataSource(filtered);
  }
}
