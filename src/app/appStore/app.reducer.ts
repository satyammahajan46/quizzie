import { ActionReducerMap } from '@ngrx/store';


import * as fromAuth from '../auth/store/auth.reducer';
import * as fromQuizzie from '../quizzie/store/quizzie.reducer';

export interface AppState {
  auth: fromAuth.State;
  quizzie: fromQuizzie.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.reducer,
  quizzie: fromQuizzie.reducer
};
