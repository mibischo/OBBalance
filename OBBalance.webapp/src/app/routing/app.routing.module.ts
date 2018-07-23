import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import components here
import { AppComponent } from '../app.component';
import { BalanceComponent } from '../balance/balance.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'balance', pathMatch: 'full' },
  { path: 'balance', component: BalanceComponent }
  //{ path: 'test', component: TestComponent }
    
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