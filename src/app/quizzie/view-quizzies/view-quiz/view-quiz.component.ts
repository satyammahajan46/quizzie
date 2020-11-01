import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Quiz } from 'src/app/models/quiz.model';
import { Store } from '@ngrx/store';
import { AppState, selectQuizzieQuiz } from 'src/app/appStore/app.reducer';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.css']
})
export class ViewQuizComponent implements OnInit, OnDestroy {
  private storeSub: Subscription;
  quiz: Quiz;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.storeSub = this.store.select(selectQuizzieQuiz).subscribe(q => {
      this.quiz = q;
    });
  }


  onCancel() {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }

  onEdit() {
    this.router.navigate(['../../edit/' + this.quiz.id], { relativeTo: this.route });
  }

}
