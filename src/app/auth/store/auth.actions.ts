import { createAction, props } from '@ngrx/store';
import { UserData, SignUpData } from '../../models/user.model';

export const LOGIN = '[Login Page] Login';
export const LOGIN_SUCESS = '[Login Page] complete';
export const SIGN_UP = '[Sign up Page] Sign up';
export const SIGNUP_SUCESS = '[Sign up Page] complete';
export const AUTH_ERROR = '[AUTH Page] error';
export const AUTH_SIGNUP_ERROR = '[AUTH Page] signup error';
export const AUTO_LOGIN = '[AUTH Page] auto login';
export const LOGOUT = '[AUTH Page] Logout';


export const login = createAction(
  LOGIN,
  props<{ userEmail: string; password: string }>()
);

export const loginSucess = createAction(
  LOGIN_SUCESS,
  props<{ user: UserData, msg: string }>()
);

export const signup = createAction(SIGN_UP,
  props<SignUpData>()
);

export const signupSucess = createAction(SIGNUP_SUCESS
);


export const autoLogin = createAction(AUTO_LOGIN
);

export const logout = createAction(LOGOUT
);



export const authenticateFail = createAction(AUTH_ERROR,
  props<{ error: string }>()
);


export const signUpFail = createAction(AUTH_SIGNUP_ERROR,
  props<{ error: [] }>()
);
