import { ActionReducerMap, createSelector } from '@ngrx/store';


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

export const selectQuizzie = (state: AppState) => state.quizzie;

export const selectQuizzieQuiz = createSelector(
  selectQuizzie,
  (state: fromQuizzie.State) => state.quizData
);



export const selectQuizzieQuizies = createSelector(
  selectQuizzie,
  (state: fromQuizzie.State) => state.quizzies
);


export const isLoadedQuizzie = createSelector(
  selectQuizzie,
  (state: fromQuizzie.State) => state.isLoaded
);

export const selectStatData = createSelector(
  selectQuizzie,
  (state: fromQuizzie.State) => state.statData
);

export const selectStatsData = createSelector(
  selectQuizzie,
  (state: fromQuizzie.State) => state.stats
);


