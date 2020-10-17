import { createAction, props } from '@ngrx/store';
import { Quiz, QuizError } from '../../models/quiz.model';


export const LOADQUIZZIES = '[Quizzie Page] loadQuizzies';
export const LOADQUIZZIESCOMPLETE = '[Quizzie Page] loadQuizziesComplete';

export const LOADQUIZ = '[Quizzie Page] loadQuiz';
export const LOADQUIZCOMPLETE = '[Quizzie Page] loadQuizComplete';

export const CREATEQUIZ = '[Quizzie Page] createQuiz';
export const EDITQUIZ = '[Quizzie Page] editQuiz';
export const C_E_QUIZ_COMPLETE = '[Quizzie Page] quizEditCreateComplete';

export const C_E_QUIZ_ERROR = '[Quizzie Page] quizEditCreateError';
export const ERROR = '[Quizzie Page] error';


export const loadQuizzies = createAction(LOADQUIZZIES, props<{
  pageNumber: number, items: number
}>());

export const loadQuizziesComplete = createAction(
  LOADQUIZZIESCOMPLETE, props<{ quizzies: Quiz[], totalItems: number }>()
);


export const loadQuiz = createAction(LOADQUIZ, props<{
  id: string
}>());

export const loadQuizComplete = createAction(
  LOADQUIZCOMPLETE, props<{ quiz: Quiz }>()
);

export const createQuiz = createAction(
  CREATEQUIZ, props<{ quiz: Quiz }>()
);

export const editQuiz = createAction(
  EDITQUIZ, props<{ quiz: Quiz }>()
);

export const cEQuizComplete = createAction(C_E_QUIZ_COMPLETE);


export const cEQuizError = createAction(
  C_E_QUIZ_ERROR, props<{ error: QuizError }>()
);

export const error = createAction(
  ERROR, props<{ error: string }>()
);

