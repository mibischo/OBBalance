import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  public attendance: Observable<any[]>;
  public selectedPlayer: any = null;

  constructor(private attendanceService: AttendanceService, private activeRoute:ActivatedRoute) { 
    this.activeRoute.paramMap.subscribe((map) => { 
      var flag = map.get("flag");

      if (flag === "old") {
        this.attendance = this.attendanceService.getOldAttendance();
      } else {
        this.attendance = this.attendanceService.getCurrentAttendance();
      }
    });
  }

  ngOnInit() {
  }

  onPlayerSelect(player: any) {
    this.selectedPlayer = player;
  }
}
