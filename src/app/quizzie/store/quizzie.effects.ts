import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserData, User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable, EMPTY, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as QuizActions from '../store/quizzie.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Question, QuizError, Options } from '../../models/quiz.model';

const parseError = (quizError: QuizError, errorData) => {
  const questionErr = errorData;
  for (const val of questionErr) {
    const quesErr: Question = { question: null, answer: null, options: null };
    const optErr: Options = { OptionA: null, OptionB: null, OptionC: null, OptionD: null };
    for (const element of val) {
      if (element.param === 'question') {
        quesErr.question = element.error;
        continue;
      }
      if (element.param === 'answer') {
        quesErr.answer = element.error;
        continue;
      }
      if (element.param === 'OptionA') {
        optErr.OptionA = element.error;
        continue;
      }
      if (element.param === 'OptionB') {
        optErr.OptionB = element.error;
        continue;
      }
      if (element.param === 'OptionC') {
        optErr.OptionC = element.error;
        continue;
      }
      if (element.param === 'OptionD') {
        optErr.OptionD = element.error;
        continue;
      }
    }
    quesErr.options = optErr;
    quizError.questions.push(quesErr);
  }
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (errorRes.error.message) {
    errorMessage = errorRes.error.message;
  }
  const quizErr: QuizError = { nameError: null, questions: [] };
  if (errorRes.error.data) {
    const errData = errorRes.error.data;

    if (errData.length === 2) {
      if (errData[0].param === 'name') {
        quizErr.nameError = errData[0].msg;
      }
      if (errData[1].param === 'questions') {
        const questionErr = errData[1].msg;
        parseError(quizErr, questionErr);
      }
    } else {
      if (errData[0].param === 'name') {
        quizErr.nameError = errData[0].msg;
      }
      if (errData[0].param === 'questions') {
        const questionErr = errData[0].msg;
        parseError(quizErr, questionErr);
      }

    }
    return of(QuizActions.cEQuizError({ error: quizErr }));
  }

  return of(QuizActions.error({ error: errorMessage }));
};


@Injectable()
export class QuizzieEffects {

  createQuizStart$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.createQuiz),
      mergeMap((action) => {

        return this.http.post(environment.backEndURL + '/quizzie/createquiz', {
          name: action.quiz.name,
          questions: action.quiz.questions
        })
          .pipe(
            map(resData => {
              this.snackBar.open('Quiz Created Succesfully. Redirecting back to dashboard!', '', {
                duration: 3000,
                panelClass: ['pop-up-msg']
              });
              return QuizActions.cEQuizComplete();
            }),
            catchError((err: Error) => {
              console.log(err);
              return handleError(err);
            })
          );
      })
    ) // action pipe ending
  );

  // IMPLEMENT IF REQUIRED TO NAVIGATE
  // cEQuizComplete$: Observable<Action> = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(QuizActions.cEQuizComplete),
  //     map()
  //   )
  // );
  constructor(
    private actions$: Actions, private http: HttpClient, private router: Router, private snackBar: MatSnackBar
  ) { }
}


//   mergeMap((action) => {
// console.log(action);

// return this.http.post(environment.backEndURL, {
//   name: action.quiz.name,
//   questions: action.quiz.questions
// }).pipe(
//   map(resData => {
//     console.log(resData);
//     return of(EMPTY);
//   })
// );
//       })
