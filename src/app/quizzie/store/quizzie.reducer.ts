import { Action, createReducer, on } from '@ngrx/store';
import * as QuizzieActions from './quizzie.actions';
import { Quiz } from '../../models/quiz.model';




export interface State {
  loading: boolean;
  isLoaded: boolean;
  quizzies: string[];
  quizData: Quiz;
}

export const initialState: State = {
  loading: false,
  isLoaded: false,
  quizzies: null,
  quizData: null
};


const authReducer = createReducer(
  initialState,
  on(QuizzieActions.loadQuizzies, state => ({ ...state, loading: true, isLoaded: false })),


);

export function reducer(state: State = initialState, action: Action) {
  return authReducer(state, action);
}
