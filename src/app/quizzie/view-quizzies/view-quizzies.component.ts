import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../appStore/app.reducer';
import { Subscription } from 'rxjs';
import { Quiz } from 'src/app/models/quiz.model';
import { PageEvent } from '@angular/material';
import { loadQuizzies } from '../store/quizzie.actions';
@Component({
  selector: 'app-view-quizzies',
  templateUrl: './view-quizzies.component.html',
  styleUrls: ['./view-quizzies.component.css'],
})
export class ViewQuizziesComponent implements OnInit, OnDestroy {
  private storeSub: Subscription;
  private totalQuizies: number;
  public quizzies: Quiz[];
  public pageEvent: PageEvent;
  constructor(
    private store: Store<AppState>
  ) { }
  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.storeSub = this.store.select('quizzie').subscribe((quizzieState) => {
      if (quizzieState.quizzies) {
        this.quizzies = quizzieState.quizzies;
      }
      this.totalQuizies = quizzieState.totalQuiz;
    });
  }

  getTotalQuiz(): number {
    return this.totalQuizies;
  }

  updateQuizzies(event) {
    // console.log(event);
    this.store.dispatch(loadQuizzies({
      pageNumber: event.pageIndex + 1,
      items: event.pageSize
    }));
    return event;

  }
}
