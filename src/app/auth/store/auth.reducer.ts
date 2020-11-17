import { Action, createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import { login, loginSucess, signup, authenticateFail, signUpFail, signupSucess, logout } from './auth.actions';



export interface State {
  user: User;
  authError: string;
  signUpError: [];
  loading: boolean;
  isLoaded: boolean;
}

export const initialState: State = {
  user: null,
  authError: null,
  loading: false,
  signUpError: null,
  isLoaded: false
};


const authReducer = createReducer(
  initialState,
  on(login, state => ({ ...state, loading: true, isLoaded: false })),
  // tslint:disable-next-line: object-literal-shorthand
  on(loginSucess, (state, { user }) => ({
    ...state,
    user: new User(user.email, user.id, user._token, user._tokenExpirationDate),
    loading: false,
    isLoaded: true
  })),
  on(signup, (state) => ({ ...state, loading: true, isLoaded: false })),
  on(authenticateFail, (state, { error }) => ({
    ...state,
    loading: false,
    authError: error,
    isLoaded: true
  })),
  on(signUpFail, (state, { error }) => ({
    ...state,
    loading: false,
    signUpError: error,
    isLoaded: true
  })),
  on(signupSucess, (state) => ({
    ...state,
    loading: false,
    signUpError: null,
    isLoaded: true
  })),

  on(logout, (state) => ({
    ...state,
    user: null
  }))

);

export function reducer(state: State = initialState, action: Action) {
  return authReducer(state, action);
}
