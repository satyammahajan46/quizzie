import { Action, createReducer, on } from '@ngrx/store';
import * as QuizzieActions from './quizzie.actions';




export interface State {
  loading: boolean;
  isLoaded: boolean;
  quizzies: string[];
}

export const initialState: State = {
  loading: false,
  isLoaded: false,
  quizzies: null
};


const authReducer = createReducer(
  initialState,
  on(QuizzieActions.loadQuizzies, state => ({ ...state, loading: true, isLoaded: false })),


);

export function reducer(state: State = initialState, action: Action) {
  return authReducer(state, action);
}
