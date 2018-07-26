import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-player-attendance',
  templateUrl: './player-attendance.component.html',
  styleUrls: ['./player-attendance.component.css']
})
export class PlayerAttendanceComponent implements OnInit {

  @Input('dataSource') set dataSource(value: any[]) {
    if (value) {
      this._dataSource = new MatTableDataSource(value);
      this.data = value;
      // this._dataSource.sort = this.sort;
      // console.log(value);
    }
  };

  @Input('playerName') set playerName(value: string) {
    if (value) {
      this._playerName = value;
    }
  };

  _playerName: string;
  data: any[];
  _dataSource = new MatTableDataSource([]);
  displayedColumns = ['name', 'pot', 'boosters', 'quater', 'raiderCut', 'leaderCut'];

  constructor() { }

  ngOnInit() {
  }
}
