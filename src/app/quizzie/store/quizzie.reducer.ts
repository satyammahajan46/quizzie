import { Action, createReducer, on } from '@ngrx/store';

import { Quiz, QuizError } from '../../models/quiz.model';
import { Stat } from 'src/app/models/stat.model';
import { error } from 'util';
// tslint:disable-next-line: max-line-length
import { loadQuizzies, loadStats, loadQuiz, createQuiz, cEQuizComplete, cEQuizError, loadQuizziesComplete, loadStatsComplete, loadQuizComplete, editQuiz, submitQuiz, submitQuizComplete } from './quizzie.actions';




export interface State {
  loading: boolean;
  isLoaded: boolean;
  quizzies: Quiz[];
  totalQuiz: number;
  quizData: Quiz;
  cEditError: QuizError;
  statData: Stat;
  stats: Stat[];
  totalStats: number;
}

export const initialState: State = {
  loading: false,
  isLoaded: false,
  quizzies: null,
  quizData: null,
  cEditError: null,
  totalQuiz: 0,
  statData: null,
  stats: null,
  totalStats: 0
};


const quizzieReducer = createReducer(
  initialState,
  on(loadQuizzies, state => ({ ...state, loading: true, isLoaded: false })),
  on(loadStats, state => ({ ...state, loading: true, isLoaded: false })),
  on(loadQuiz, state => ({ ...state, loading: true, isLoaded: false })),
  on(createQuiz, state => ({
    ...state,
    loading: true,
    isLoaded: false
  })),
  on(cEQuizComplete, state => ({
    ...state,
    loading: false,
    isLoaded: true
  })),
  on(cEQuizError, (state, { error }) => ({
    ...state,
    loading: false,
    isLoaded: true,
    cEditError: error
  })),
  on(loadQuizziesComplete, (state, { quizzies, totalItems }) => ({
    ...state,
    loading: false,
    isLoaded: true,
    quizzies,
    totalQuiz: totalItems
  })),
  on(loadStatsComplete, (state, { stats, totalItems }) => ({
    ...state,
    loading: false,
    isLoaded: true,
    stats,
    totalStats: totalItems
  })),
  on(error, state => ({
    ...state,
    loading: false,
    isLoaded: true
  })),
  on(loadQuizComplete, (state, { quiz }) => ({
    ...state,
    loading: false,
    isLoaded: true,
    quizData: quiz,
  })),
  on(editQuiz, state => ({
    ...state,
    loading: true,
    isLoaded: false
  })),
  on(submitQuiz, state => ({
    ...state,
    loading: true,
    isLoaded: false
  })),
  on(submitQuizComplete, (state, { stat }) => ({
    ...state,
    loading: false,
    isLoaded: true,
    statData: stat
  })),




);

export function reducer(state: State = initialState, action: Action) {
  return quizzieReducer(state, action);
}
