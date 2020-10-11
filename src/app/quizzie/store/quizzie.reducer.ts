import { Action, createReducer, on } from '@ngrx/store';
import * as QuizzieActions from './quizzie.actions';
import { Quiz, QuizError } from '../../models/quiz.model';




export interface State {
  loading: boolean;
  isLoaded: boolean;
  quizzies: string[];
  quizData: Quiz;
  cEditError: QuizError;
}

export const initialState: State = {
  loading: false,
  isLoaded: false,
  quizzies: null,
  quizData: null,
  cEditError: null
};


const quizzieReducer = createReducer(
  initialState,
  on(QuizzieActions.loadQuizzies, state => ({ ...state, loading: true, isLoaded: false })),
  on(QuizzieActions.createQuiz, state => ({
    ...state,
    loading: true,
    isLoaded: false
  })),
  on(QuizzieActions.cEQuizComplete, state => ({
    ...state,
    loading: false,
    isLoaded: true
  })),
  on(QuizzieActions.cEQuizError, (state, { error }) => ({
    ...state,
    loading: false,
    isLoaded: true,
    cEditError: error
  })),



);

export function reducer(state: State = initialState, action: Action) {
  return quizzieReducer(state, action);
}
