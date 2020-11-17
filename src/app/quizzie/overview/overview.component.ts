import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Quiz } from 'src/app/models/quiz.model';
import * as fromApp from '../../appStore/app.reducer';
import * as QuizzieActions from '../store/quizzie.actions'
import { Question } from '../../models/quiz.model';
import { Router, ActivatedRoute } from '@angular/router';
import { selectStatData, selectStatsData } from '../../appStore/app.reducer';
import { Stat } from 'src/app/models/stat.model';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {
  private storeQuizzieSub: Subscription;
  private storeQuizSub: Subscription;
  private storeStatSub: Subscription;
  quizzies: Quiz[];
  isLoaded: boolean;
  selectedQuiz: string;
  questions: Question[];
  loadedQuiz: Quiz;
  statData: Stat[];

  classAverage: number;
  totalParticipants: number;
  bestScore: number;
  bestScoreName: string;
  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar

  ) {
    this.isLoaded = false;
    this.selectedQuiz = '';
    this.questions = null;
  }

  ngOnInit(): void {
    this.isLoaded = false;
    this.storeQuizzieSub = this.store.select(fromApp.selectQuizzieQuizies).subscribe(quizzies => {
      // console.log(quizzies);
      if (quizzies && quizzies.length) {
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

    this.storeStatSub = this.store.select(selectStatsData).subscribe(statData => {

      if (this.statData && this.statData.length) {
        this.statData = statData;
        this.loadStatInfo();
      }
    });

  }


  underDev() {
    this.snackBar.open('Under Development', '', {
      duration: 3000,
      panelClass: ['danger-pop-up-msg']
    });
  }
  loadStatInfo() {
    this.totalParticipants = this.statData.length;
    this.classAverage = 0;
    this.bestScore = 0;
    this.bestScoreName = '';
    this.statData.forEach(element => {
      const acc = element.correctAnswers / element.totalQuestions;
      this.classAverage += acc;
      if (acc > this.bestScore) {
        this.bestScore = acc;
        this.bestScoreName = element.name;
      }
    });
    this.classAverage /= this.totalParticipants;
    this.classAverage *= 100;
    this.bestScore *= 100;
  }
  ngOnDestroy(): void {
    if (this.storeQuizzieSub) {
      this.storeQuizzieSub.unsubscribe();
    }

    if (this.storeQuizSub) {
      this.storeQuizSub.unsubscribe();
    }
    if (this.storeStatSub) {
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
    this.store.dispatch(QuizzieActions.loadStats({ quizID: this.quizzies[index].id }));
  }

  viewQuiz() {
    this.router.navigate(['../quiz/view', this.loadedQuiz.id], { relativeTo: this.route });
  }

}
