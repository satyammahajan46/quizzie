import { createAction, props } from '@ngrx/store';
import { Quiz } from '../../models/quiz.model';


export const LOADQUIZZIES = '[Quizzie Page] loadQuizzies';
export const LOADQUIZZIESCOMPLETE = '[Quizzie Page] loadQuizziesComplete';

export const CREATEQUIZ = '[Quizzie Page] createQuiz';
export const EDITQUIZ = '[Quizzie Page] editQuiz';
export const C_E_QUIZ_COMPLETE = '[Quizzie Page] quizEditCreateComplete';


export const loadQuizzies = createAction(LOADQUIZZIES);

export const loadQuizziesComplete = createAction(
  LOADQUIZZIESCOMPLETE, props<{ quizzies: string[] }>()
);

export const createQuiz = createAction(
  CREATEQUIZ, props<{ quiz: Quiz }>()
);

export const editQuiz = createAction(
  EDITQUIZ, props<{ quiz: Quiz }>()
);

export const cEQuizComplete = createAction(C_E_QUIZ_COMPLETE);

