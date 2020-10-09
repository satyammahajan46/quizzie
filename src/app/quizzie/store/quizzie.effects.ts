import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserData, User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';



@Injectable()
export class AuthEffects {


  constructor(
    private actions$: Actions, private http: HttpClient, private router: Router, private snackBar: MatSnackBar
  ) { }
}
