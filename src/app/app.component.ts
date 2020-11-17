import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { slideInAnimation } from './animations';
import { AppState } from './appStore/app.reducer';
import { autoLogin } from './auth/store/auth.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit {
  title = 'Quizzie';
  constructor(private titleService: Title, private store: Store<AppState>) {
    this.titleService.setTitle(this.title);
  }
  ngOnInit() {
    this.store.dispatch(autoLogin());

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
