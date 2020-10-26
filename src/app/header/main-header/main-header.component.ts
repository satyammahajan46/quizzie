import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../appStore/app.reducer';
import * as AuthActions from '../../auth/store/auth.actions'
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})

export class MainHeaderComponent implements OnInit {


  homeDashboard: ButtonInfo;
  loginLogout: ButtonInfo;
  isAuth = false;
  storeSub: Subscription;
  constructor(
    private store: Store<fromApp.AppState>,
  ) {

  }


  ngOnInit() {
    this.changeButtonInfo();
    this.storeSub = this.store.select('auth').subscribe(authState => {
      if (authState.user) {
        this.isAuth = true;
        this.changeButtonInfo();
      } else {
        this.isAuth = false;
        this.changeButtonInfo();
      }
    });
  }
  changeButtonInfo() {
    if (this.isAuth) {
      this.homeDashboard = { title: 'Dashboard', link: '/quizzie/overview', icon: 'table_chart' };
      this.loginLogout = { title: 'Logout', link: '/auth', icon: 'account_circle' };
    } else {
      this.homeDashboard = { title: 'Home', link: '/home', icon: 'home' };
      this.loginLogout = { title: 'Login', link: '/auth', icon: 'account_circle' };
    }
  }
  onSubmit() {
    if (this.isAuth) {
      this.store.dispatch(AuthActions.logout());
    }
  }
}

interface ButtonInfo {
  title: string;
  link: string;
  icon: string;
}
