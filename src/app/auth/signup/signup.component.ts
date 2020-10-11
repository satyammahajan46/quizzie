import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { MustMatch } from '../../shared/must.match.validator';
import { Store } from '@ngrx/store';
import * as fromApp from '../../appStore/app.reducer';
import * as AuthActions from '../store/auth.actions';
import { SignUpData } from '../../models/user.model';
import { Subscription, Subject, Observable } from 'rxjs';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signUpform: FormGroup;
  private storeSub: Subscription;
  private error: [];
  private isLoadingResult: boolean;
  constructor(private formBuilder: FormBuilder, private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {


    this.signUpform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      cPassword: ['', [Validators.required]]
    }, { validator: MustMatch('password', 'cPassword') });


    // this.signUpform = this.formBuilder.group({
    //   email: [''],
    //   name: [''],
    //   password: [''],
    //   cPassword: ['']
    // });

    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.error = authState.signUpError ? authState.signUpError : [];
      this.isLoadingResult = authState.loading;
      // console.log(authState.isLoaded);
      if (authState.isLoaded) {
        this.parseError();
      }
    });

    this.signUpform.get('email').valueChanges.subscribe(val => {
      const email = this.signUpform.get('email');
      if (email.hasError('serverError')) {
        email.setErrors(null);
      }
    });

    this.signUpform.get('name').valueChanges.subscribe(val => {
      const name = this.signUpform.get('name');
      if (name.hasError('serverError')) {
        name.setErrors(null);
      }
    });

    this.signUpform.get('password').valueChanges.subscribe(val => {
      const password = this.signUpform.get('password');
      if (password.hasError('serverError')) {
        password.setErrors(null);
      }
    });

    this.signUpform.get('cPassword').valueChanges.subscribe(val => {
      const cPassword = this.signUpform.get('cPassword');
      if (cPassword.hasError('serverError')) {
        cPassword.setErrors(null);
      }
    });
  }


  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
  onSubmit() {
    if (this.signUpform.invalid) {
      return;
    }
    // TODO: CREATE CONNECT WITH BACKEND USE STORE
    const data: SignUpData = {
      email: this.signUpform.value.email,
      name: this.signUpform.value.name,
      password: this.signUpform.value.password,
      cPassword: this.signUpform.value.cPassword
    };
    this.store.dispatch(AuthActions.signup(data));

  }

  getFormControls() {
    return this.signUpform.controls;
  }

  getErrorMessage(controlName: string) {
    const obj = this.getFormControls()[controlName];
    if (!obj) {
      return '';
    }
    if (obj.hasError('required')) {
      return 'Required Field';
    }
    if (obj.hasError('email')) {
      return 'Enter a valid email';
    }
    if (obj.hasError('minlength')) {
      return 'Password must be minimum 8 characters';
    }
    if (obj.hasError('mustMatch')) {
      return 'Password must match';
    }
  }


  isError(): boolean {
    return this.error.length > 0 ? true : false;
  }


  isLoading(): boolean {
    return this.isLoadingResult;
  }

  parseError() {
    Object.entries(this.error).forEach((item) => {
      const err: { value: string, msg: string, param: string, location: string } = JSON.parse(JSON.stringify(item[1]));
      const control: AbstractControl = this.signUpform.get(err.param);
      if (control) {
        // console.log(err.msg);
        control.setValidators([this.serverValidator(err.msg)]);
        control.updateValueAndValidity();
      }
    });
    console.log(this.signUpform);

    // this.signUpform.updateValueAndValidity();

  }

  private serverValidator(errMsg: string) {

    return (control: AbstractControl): ValidationErrors => {
      return { serverError: errMsg };
    };
  }


  // serverValidator(errMsg: string) {

  //   return (control: AbstractControl): Promise<any> => {
  //     return new Promise((resolve, reject) => {
  //       resolve({ serverError: errMsg });
  //     });
  //   };
  // }


}
