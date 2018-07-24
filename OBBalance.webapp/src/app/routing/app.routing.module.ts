import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import components here
import { AppComponent } from '../app.component';
import { BalanceComponent } from '../balance/balance.component';
import { AttendanceComponent } from '../attendance/attendance.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'balance', pathMatch: 'full' },
  { path: 'balance', component: BalanceComponent, data: { title: 'Balance' } },
  { path: 'attendance', component: AttendanceComponent, data: { title: 'Attendance' } }
    
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}