import { Action, createReducer, on } from '@ngrx/store';
import * as AuthAction from './auth.actions';
import { UserData, User } from '../../models/user.model';



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
  on(AuthAction.login, state => ({ ...state, loading: true, isLoaded: false })),
  // tslint:disable-next-line: object-literal-shorthand
  on(AuthAction.loginSucess, (state, { user }) => ({
    ...state,
    user: new User(user.email, user.id, user._token, user._tokenExpirationDate),
    loading: false,
    isLoaded: true
  })),
  on(AuthAction.signup, (state) => ({ ...state, loading: true, isLoaded: false })),
  on(AuthAction.authenticateFail, (state, { error }) => ({
    ...state,
    loading: false,
    authError: error,
    isLoaded: true
  })),
  on(AuthAction.signUpFail, (state, { error }) => ({
    ...state,
    loading: false,
    signUpError: error,
    isLoaded: true
  })),
  on(AuthAction.signupSucess, (state) => ({
    ...state,
    loading: false,
    signUpError: null,
    isLoaded: true
  })),

  on(AuthAction.logout, (state) => ({
    ...state,
    user: null
  }))

);

export function reducer(state: State = initialState, action: Action) {
  return authReducer(state, action);
}
