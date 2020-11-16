import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, selectQuizzieQuiz } from 'src/app/appStore/app.reducer';
import { selectQuizzie } from '../../../appStore/app.reducer';
import { Stat } from '../../../models/stat.model';

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.css']
})
export class ViewResultsComponent implements OnInit, OnDestroy {
  private storeSub: Subscription;
  stats: Stat;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.storeSub = this.store.select(selectQuizzie).subscribe(q => {
      this.stats = q.statData;
    });

  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
