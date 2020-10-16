import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as fromApp from '../appStore/app.reducer';
import { MatSnackBar } from '@angular/material';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>,
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
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      map(user => {
        const isAuth = !!user;
        if (isAuth && user.getToken()) {
          return true;
        }
        this.snackBar.open('Not Authorized! Sign-in required', '', {
          duration: 3000,
          panelClass: ['pop-up-msg']
        });
        return this.router.createUrlTree(['/auth']);
      })
      // tap(isAuth => {
      //   if (!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.canActivate(route, router);
  }
}
