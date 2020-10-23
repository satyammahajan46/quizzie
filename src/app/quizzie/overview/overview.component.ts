import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Quiz } from 'src/app/models/quiz.model';
import * as fromApp from '../../appStore/app.reducer';
import * as QuizzieActions from '../store/quizzie.actions'
import { Question } from '../../models/quiz.model';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {
  private storeSub: Subscription;
  quizzies: Quiz[];
  isLoaded: boolean;
  selectedQuiz: string;
  questions: Question[];
  constructor(
    private store: Store<fromApp.AppState>,

  ) {
    this.isLoaded = false;
    this.selectedQuiz = '';
    this.questions = null;
  }

  ngOnInit(): void {

    this.storeSub = this.store.select(fromApp.selectQuizzieQuizies).subscribe(quizzies => {
      console.log(quizzies);
      if (quizzies) {
        if (quizzies.length > 3) {
          this.quizzies = quizzies.slice(0, 3);
        } else {
          this.quizzies = quizzies;
        }

        this.isLoaded = true;
      }
    });
  }
  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  isQuizSelected(quizName: string): boolean {
    return this.selectedQuiz === quizName;
  }

  onQuizSelect(index: number) {
    this.selectedQuiz = this.quizzies[index].name;
    this.questions = this.quizzies[index].questions;
  }

}
