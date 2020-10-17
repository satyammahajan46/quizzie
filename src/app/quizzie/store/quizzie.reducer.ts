import { Action, createReducer, on } from '@ngrx/store';
import * as QuizzieActions from './quizzie.actions';
import { Quiz, QuizError } from '../../models/quiz.model';




export interface State {
  loading: boolean;
  isLoaded: boolean;
  quizzies: Quiz[];
  totalQuiz: number;
  quizData: Quiz;
  cEditError: QuizError;
}

export const initialState: State = {
  loading: false,
  isLoaded: false,
  quizzies: null,
  quizData: null,
  cEditError: null,
  totalQuiz: 0
};


const quizzieReducer = createReducer(
  initialState,
  on(QuizzieActions.loadQuizzies, state => ({ ...state, loading: true, isLoaded: false })),
  on(QuizzieActions.loadQuiz, state => ({ ...state, loading: true, isLoaded: false })),
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
  on(QuizzieActions.loadQuizziesComplete, (state, { quizzies, totalItems }) => ({
    ...state,
    loading: false,
    isLoaded: true,
    quizzies,
    totalQuiz: totalItems
  })),
  on(QuizzieActions.error, state => ({
    ...state,
    loading: false,
    isLoaded: true
  })),
  on(QuizzieActions.loadQuizComplete, (state, { quiz }) => ({
    ...state,
    loading: false,
    isLoaded: true,
    quizData: quiz,
  }))




);

export function reducer(state: State = initialState, action: Action) {
  return quizzieReducer(state, action);
}
