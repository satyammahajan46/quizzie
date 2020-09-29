import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { take, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../appStore/app.reducer';
import { User } from '../models/user.model';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      mergeMap((user: User) => {
        if (!user) {
          return next.handle(req);
        }
        if (!user.getToken()) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + user.getToken())
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
