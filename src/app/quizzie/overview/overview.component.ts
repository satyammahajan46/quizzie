import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Quiz } from 'src/app/models/quiz.model';
import * as fromApp from '../../appStore/app.reducer';
import * as QuizzieActions from '../store/quizzie.actions'
import { Question } from '../../models/quiz.model';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {
  private storeQuizzieSub: Subscription;
  private storeQuizSub: Subscription;
  quizzies: Quiz[];
  isLoaded: boolean;
  selectedQuiz: string;
  questions: Question[];
  loadedQuiz: Quiz;
  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.isLoaded = false;
    this.selectedQuiz = '';
    this.questions = null;
  }

  ngOnInit(): void {

    this.storeQuizzieSub = this.store.select(fromApp.selectQuizzieQuizies).subscribe(quizzies => {
      // console.log(quizzies);
      if (quizzies) {
        if (quizzies.length > 3) {
          this.quizzies = quizzies.slice(0, 3);
        } else {
          this.quizzies = quizzies;
        }

        this.isLoaded = true;
      }
    });

    this.storeQuizSub = this.store.select(fromApp.selectQuizzieQuiz).subscribe(quiz => {
      // console.log(quiz);
      if (quiz) {
        this.loadedQuiz = quiz;
        if (quiz.questions.length > 3) {
          this.questions = quiz.questions.slice(0, 3);
        } else {
          this.questions = quiz.questions;
        }

      }
    });

  }
  ngOnDestroy(): void {
    if (this.storeQuizzieSub) {
      this.storeQuizzieSub.unsubscribe();
    }

    if (this.storeQuizSub) {
      this.storeQuizSub.unsubscribe();
    }
  }

  isQuizSelected(quizName: string): boolean {
    return this.selectedQuiz === quizName;
  }

  onQuizSelect(index: number) {
    this.selectedQuiz = this.quizzies[index].name;
    // this.questions = this.quizzies[index].questions;

    this.store.dispatch(QuizzieActions.loadQuiz({ id: this.quizzies[index].id }));
  }

  viewQuiz() {
    this.router.navigate(['../quiz/view', this.loadedQuiz.id], { relativeTo: this.route });
  }

}
