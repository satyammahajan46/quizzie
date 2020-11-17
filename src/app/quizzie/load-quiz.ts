import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, take, mergeMap } from 'rxjs/operators';
import { AppState } from '../appStore/app.reducer';
import { loadQuiz, loadQuizComplete } from './store/quizzie.actions';
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
        this.store.dispatch(loadQuiz({ id: route.paramMap.get('id') }));
        return this.actions$.pipe(
          ofType(loadQuizComplete),
          take(1)
        );
      })
    );
  }

}
