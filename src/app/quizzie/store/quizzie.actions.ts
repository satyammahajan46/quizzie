import { createAction, props } from '@ngrx/store';


export const LOADQUIZZIES = '[Quizzie Page] loadQuizzies';
export const LOADQUIZZIESCOMPLETE = '[Quizzie Page] loadQuizziesComplete';


export const loadQuizzies = createAction(
  LOADQUIZZIES
);

export const loadQuizziesComplete = createAction(
  LOADQUIZZIESCOMPLETE, props<{ quizzies: string[] }>()
);
