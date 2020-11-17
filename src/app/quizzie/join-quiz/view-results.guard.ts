import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';
import { AppState, selectQuizzie } from '../../appStore/app.reducer';
@Injectable({ providedIn: 'root' })
export class ViewResultsGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select(selectQuizzie).pipe(
      take(1),
      map(quizzieState => {
        return quizzieState.statData;
      }),
      map(statData => {
        const isAuth = !!statData;
        if (isAuth) {
          return true;
        }
        this.snackBar.open('Unauthorized access', '', {
          duration: 3000,
          panelClass: ['pop-up-msg']
        });
        return this.router.createUrlTree(['quizzie/join-quiz']);
      })
      // tap(isAuth => {
      //   if (!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
    );
  }
}
