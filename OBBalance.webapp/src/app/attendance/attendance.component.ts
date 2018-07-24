import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  public attendance: Observable<any[]>;
  public selectedPlayer: any = null;

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit() {
    this.attendance = this.attendanceService.get();
  }

  onPlayerSelect(player: any) {
    this.selectedPlayer = player;
  }
}
