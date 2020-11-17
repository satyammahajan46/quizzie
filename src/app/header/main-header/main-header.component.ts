import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { logout } from '../../auth/store/auth.actions';
import { AppState } from 'src/app/appStore/app.reducer';
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
    private store: Store<AppState>,
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
      this.store.dispatch(logout());
    }
  }
}

interface ButtonInfo {
  title: string;
  link: string;
  icon: string;
}
