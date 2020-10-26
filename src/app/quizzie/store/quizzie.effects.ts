import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserData, User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable, EMPTY, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as QuizActions from '../store/quizzie.actions';
import { mergeMap, map, catchError, tap, take } from 'rxjs/operators';
import { Question, QuizError, Options, Quiz } from '../../models/quiz.model';

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
};

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

  editQuizStart$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.editQuiz),
      mergeMap((action) => {

        return this.http.put(environment.backEndURL + '/quizzie/quiz/' + action.quiz.id, {
          name: action.quiz.name,
          questions: action.quiz.questions
        })
          .pipe(
            map(resData => {
              this.snackBar.open('Quiz Edited Succesfully. Redirecting back to dashboard!', '', {
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


  loadQuizzies$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.loadQuizzies),
      mergeMap((action) => {
        const param = new HttpParams()
          .set('page', action.pageNumber.toString())
          .set('pp', action.items.toString());
        return this.http.get<{
          message: string,
          quizzies: any,
          totalItems: number
        }>(environment.backEndURL + '/quizzie/quizzies', { params: param })
          .pipe(
            map(resData => {
              // this.snackBar.open('Quiz Created Succesfully. Redirecting back to dashboard!', '', {
              //   duration: 3000,
              //   panelClass: ['pop-up-msg']
              // });
              const quizzies = resData.quizzies;
              const parsedData: Quiz[] = Array();
              for (const quiz of quizzies) {
                const data = quiz.questions[0];
                const question: Question = {
                  question: data.question,
                  id: data._id,
                  options: {
                    OptionA: data.options[0],
                    OptionB: data.options[1],
                    OptionC: data.options[2],
                    OptionD: data.options[3]
                  }
                };

                parsedData.push(
                  new Quiz(quiz._id, quiz.name, [question], quiz.joinID)
                );
              }
              return QuizActions.loadQuizziesComplete({ quizzies: parsedData, totalItems: +resData.totalItems });
            }),
            catchError((err: any) => {
              let msg = 'An unknown error occured!';
              if (err.message) {
                msg = err.message;
              }
              if (err.error && err.error.message) {
                msg = err.error.message;
              }
              this.snackBar.open(msg, '', {
                duration: 3000,
                panelClass: ['danger-pop-up-msg']
              });
              return of(QuizActions.error({ error: msg }));
            })
          );
      })
    ) // action pipe ending
  );


  loadQuiz$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.loadQuiz),
      mergeMap((action) => {
        return this.http.get<{
          message: string,
          quiz: any,
        }>(environment.backEndURL + '/quizzie/quiz/' + action.id)
          .pipe(
            map(resData => {

              const quiz = resData.quiz;
              const parsedData: Quiz = {
                name: quiz.name,
                id: quiz._id,
                questions: null
              };
              const questions: Question[] = Array();
              quiz.questions.forEach(element => {
                const ques: Question = {
                  question: element.question,
                  options: {
                    OptionA: element.options[0],
                    OptionB: element.options[1],
                    OptionC: element.options[2],
                    OptionD: element.options[3]
                  },
                  id: element._id,
                  answer: element.answer
                };
                questions.push(ques);
              });
              parsedData.questions = questions;
              parsedData.joinID = quiz.joinID;
              return QuizActions.loadQuizComplete({ quiz: parsedData });
            }),
            catchError((err: Error) => {

              let msg = 'An unknown error occured!';
              if (err.message) {
                msg = err.message;
              }
              this.snackBar.open(msg, '', {
                duration: 3000,
                panelClass: ['danger-pop-up-msg']
              });
              return of(QuizActions.error({ error: msg }));
            })
          );
      })
    ) // action pipe ending
  );

  genericError$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.error),
      tap((action) => {
        this.snackBar.open(action.error, '', {
          duration: 3000,
          panelClass: ['danger-pop-up-msg']
        });
      })
    ), { dispatch: false }
  );

  // IMPLEMENT IF REQUIRED TO NAVIGATE & reload quizzies
  cEQuizComplete$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.cEQuizComplete),
      map(action => {
        this.router.navigate(['quizzie']);
        return QuizActions.loadQuizzies({ pageNumber: 1, items: 5 });
      })
    )
  );

  constructor(
    private actions$: Actions, private http: HttpClient, private router: Router, private snackBar: MatSnackBar
  ) { }
}



