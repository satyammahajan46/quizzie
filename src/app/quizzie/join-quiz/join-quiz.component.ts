import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { loadJoinQuiz } from '../store/quizzie.actions';

import { Actions } from '@ngrx/effects';

import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AppState, selectQuizzieQuiz } from 'src/app/appStore/app.reducer';


@Component({
  selector: 'app-join-quiz',
  templateUrl: './join-quiz.component.html',
  styleUrls: ['./join-quiz.component.css']
})
export class JoinQuizComponent implements OnInit, OnDestroy {

  quizName = 'Loading...';
  isValid: boolean;
  quizPinForm: FormGroup;
  private storeQuizSub: Subscription;
  nameForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions
  ) {
  }

  ngOnDestroy(): void {
    if (this.storeQuizSub) {
      this.storeQuizSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.quizPinForm = this.formBuilder.group({
      pin: ['', [Validators.required]]
    });
    this.nameForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });

    this.storeQuizSub = this.store.select(selectQuizzieQuiz).subscribe(q => {
      if (q) {
        this.quizName = q.name;
        this.isValid = true;
      } else {
        this.quizName = 'No Quiz Found';
        this.isValid = false;
      }
    });

  }

  // fetchQuizValidation(control: FormControl): Promise<any> | Observable<any> {
  //   const promise = new Promise<any>((resolve, reject) => {
  //     // let debounceTime = 1000; //milliseconds
  //     // const debounceTimer = timer(debounceTime);
  //     console.log(this.quizPinForm);
  //     return control.valuechanges.pipe(
  //       // debounceTime(1000),
  //       // distinctUntilChanged(),
  //       mergeMap(() => {
  //         const pin = this.quizPinForm.get('pin').value;
  //         this.store.dispatch(loadJoinQuiz({ pin }));
  //         return this.actions$.pipe(
  //           ofType(loadQuizComplete),
  //           take(1),
  //           map(() => {
  //             return resolve(null);
  //           }),
  //           catchError(err => {
  //             console.log(err);
  //             resolve({ 'invalidPin': true });
  //             return of(error({ error: err.error.message }));
  //           })
  //         ).pipe(first());
  //       }),
  //     ).pipe(first());
  //   });
  //   return promise;
  // }

  selectionChange(event) {
    // console.log(event.selectedIndex);
    if (event.selectedIndex === 1 || event.selectedIndex === 2) {
      this.fetchQuiz();
    }
  }

  fetchQuiz() {
    if (this.quizPinForm.valid) {
      const pin = this.quizPinForm.get('pin').value;
      this.store.dispatch(loadJoinQuiz({ pin }));
    }
  }

  onSubmit() {
    const quizPin = this.quizPinForm.value.pin;
    const name = this.nameForm.value.name;

    const navigationExtra: NavigationExtras = {
      state: {
        fullname: name
      },
      relativeTo: this.route
    };
    this.router.navigate(['./' + quizPin], navigationExtra);
  }
}
