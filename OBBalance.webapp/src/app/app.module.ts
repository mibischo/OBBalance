import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MyMaterialModule } from './utils/material.module';
import { AppRoutingModule } from './routing/app.routing.module';
import { BalanceComponent } from './balance/balance.component';
import { BalanceTableComponent } from './balance/balance-table/balance-table.component';
import { AttendanceComponent } from './attendance/attendance.component';


@NgModule({
  declarations: [
    AppComponent,
    BalanceComponent,
    BalanceTableComponent,
    AttendanceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MyMaterialModule,


    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
