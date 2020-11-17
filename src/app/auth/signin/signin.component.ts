import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { AppState } from 'src/app/appStore/app.reducer';
import { login } from '../store/auth.actions';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {

  signInform: FormGroup;

  private storeSub: Subscription;
  private error: string;
  private isLoadingResult: boolean;
  constructor(private formBuilder: FormBuilder, private store: Store<AppState>) { }
  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.signInform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.error = authState.authError;
      this.isLoadingResult = authState.loading;
    });
  }

  onSubmit() {
    if (this.signInform.invalid) {
      return;
    }
    // TODO: CREATE CONNECT WITH BACKEND USE STORE
    this.store.dispatch(
      login({
        userEmail: this.signInform.value.email,
        password: this.signInform.value.password
      })
    );
    // console.log(JSON.stringify(this.signInform.value));
  }


  getFormControls() {
    return this.signInform.controls;
  }

  getErrorMessage(controlName: string) {
    const obj = this.getFormControls()[controlName];
    if (obj.hasError('required')) {
      return 'Required Field';
    }
    if (obj.hasError('email')) {
      return 'Enter a valid email';
    }
    if (obj.hasError('minlength')) {
      return 'Password must be minimum 8 characters';
    }
  }

  isError(): boolean {
    return this.error ? true : false;
  }

  getLoginError() {
    return this.error;
  }

  isLoading(): boolean {
    return this.isLoadingResult;
  }

}
