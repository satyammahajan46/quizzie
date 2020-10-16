import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from './appStore/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { slideInAnimation } from './animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit {
  title = 'Quizzie';
  constructor(private titleService: Title, private store: Store<fromApp.AppState>) {
    this.titleService.setTitle(this.title);
  }
  ngOnInit() {
    this.store.dispatch(AuthActions.autoLogin());

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
