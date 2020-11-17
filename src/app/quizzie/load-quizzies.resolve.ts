import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, take, mergeMap } from 'rxjs/operators';
import { AppState } from '../appStore/app.reducer';
import { loadQuizzies, loadQuizziesComplete } from './store/quizzie.actions';
@Injectable({
  providedIn: 'root'
})
export class LoadQuizzies {

  constructor(
    private store: Store<AppState>,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('quizzie').pipe(
      take(1),
      map(quizState => {
        return quizState.quizzies;
      }),
      mergeMap(quizzies => {
        if (!quizzies || quizzies.length === 0) {
          this.store.dispatch(loadQuizzies({ pageNumber: 1, items: 5 }));
          return this.actions$.pipe(
            ofType(loadQuizziesComplete),
            take(1)
          );
        } else {
          return of(quizzies);
        }
      })
    );
  }

}
