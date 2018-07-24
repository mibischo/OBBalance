import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.css']
})
export class PlayerTableComponent implements OnInit {

  @Input('dataSource') set dataSource(value: any[]) {
    if (value) {
      this._dataSource = new MatTableDataSource(value);
      this.data = value;
      // this._dataSource.sort = this.sort;
      console.log(value);
    }
  };

  @Output('onSelect') onSelect = new EventEmitter();

  data: any[];
  _dataSource = new MatTableDataSource([]);
  displayedColumns = ['name', 'nrRaids'];

  constructor() { }

  ngOnInit() {
  }

  search(value) {
    let filtered = this.data.filter(p => p.player.toLowerCase().startsWith(value.toLowerCase()));
    this._dataSource = new MatTableDataSource(filtered);
  }

  selectPlayer(player: any) {
    this.onSelect.emit(player);
  }
}
