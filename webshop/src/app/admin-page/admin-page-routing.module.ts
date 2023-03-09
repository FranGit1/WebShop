import { NgModule, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { CredentialsService } from 'app/credentials.service';
import { AuthService } from 'app/shared/auth.service';
import { User } from 'app/shared/user.model';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
