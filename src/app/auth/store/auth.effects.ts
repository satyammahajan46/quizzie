import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserData, User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { loginSucess, authenticateFail, signUpFail, login, signup, signupSucess, autoLogin, logout } from './auth.actions';



const handleAuthentication = (
  user: UserData
) => {
  localStorage.setItem('userData', JSON.stringify(user));
  return loginSucess({ user, msg: 'User Authenticated' });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error) {
    return of(authenticateFail({ error: errorMessage }));
  }
  if (errorRes.error.message) {
    errorMessage = errorRes.error.message;
  }
  if (errorRes.error.data) {
    return of(signUpFail({ error: errorRes.error.data }));
  }

  return of(authenticateFail({ error: errorMessage }));
};

@Injectable()
export class AuthEffects {

  loginStart$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap((action) => {
        // console.log();
        // const user = {
        //   email: action.userEmail,
        //   id: 'Retieve From backend',
        //   _token: 'Retreive from backend',
        //   _tokenExpirationDate: new Date()
        // };
        // return loginSucess({ user });
        // // return the http observalble
        // // return this.http
        return this.http.post<{ token: string, userId: string, expiresIn: string }>(environment.backEndURL + '/auth/login', {
          email: action.userEmail,
          password: action.password
        }).pipe(
          map(resData => {
            // console.log(resData);
            const userD: UserData = {
              email: action.userEmail,
              id: resData.userId,
              _token: resData.token,
              _tokenExpirationDate: new Date(Date.parse(resData.expiresIn))
            };
            return handleAuthentication(userD);
          }),
          catchError((err: Error) => {
            return handleError(err);
          })
        );
      }
      )
    )// action pipe ending
  );

  signupStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      mergeMap(action => {
        return this.http.post(environment.backEndURL + '/auth/signup', {
          email: action.email,
          password: action.password,
          cPassword: action.cPassword,
          name: action.name
        }).pipe(
          map(resData => {
            console.log(resData);
            return signupSucess();
          }),
          catchError((err: Error) => {
            return handleError(err);
          })
        );
      })
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSucess),
      tap(action => {
        this.snackBar.open(action.msg, '', {
          duration: 3000,
          panelClass: ['pop-up-msg']
        });
        this.router.navigate(['./quizzie']);
      })
    ), { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autoLogin),
      map(() => {
        const userData: UserData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return { type: 'DUMMY' };
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, userData._tokenExpirationDate);
        if (loadedUser.getToken()) {
          return loginSucess({ user: userData, msg: 'Welcome Back!' });
        }
        return { type: 'DUMMY' };
      })
    )
  );

  signupSucesst$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signupSucess),
      tap(action => {
        this.snackBar.open('Signed Up Succesfully! Redirecting to login...', '', {
          duration: 3000,
          panelClass: ['pop-up-msg']
        });
        this.router.navigate(['./auth/signin']);
      })
    ), { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(action => {
        localStorage.removeItem('userData');
        this.snackBar.open('Logged Out Succesfully!', '', {
          duration: 3000,
          panelClass: ['pop-up-msg']
        });
        this.router.navigate(['/home']);
      })
    ), { dispatch: false }
  );

  constructor(
    private actions$: Actions, private http: HttpClient, private router: Router, private snackBar: MatSnackBar
  ) { }
}
