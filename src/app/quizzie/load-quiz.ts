import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, take, mergeMap } from 'rxjs/operators';
import { AppState } from '../appStore/app.reducer';
import * as QuizzieActions from './store/quizzie.actions';
@Injectable({
  providedIn: 'root'
})
export class LoadQuiz {

  constructor(
    private store: Store<AppState>,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('quizzie').pipe(
      take(1),
      map(quizState => {
        return quizState.quizData;
      }),
      mergeMap(quiz => {
        if (!quiz) {
          this.store.dispatch(QuizzieActions.loadQuiz({ id: route.paramMap.get('id') }));
          return this.actions$.pipe(
            ofType(QuizzieActions.loadQuizComplete),
            take(1)
          );
        } else {
          return of(quiz);
        }
      })
    );
  }

}
