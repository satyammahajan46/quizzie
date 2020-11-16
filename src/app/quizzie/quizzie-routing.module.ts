import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { QuizEditComponent } from './quiz-edit/quiz-edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { ViewQuizziesComponent } from './view-quizzies/view-quizzies.component';
import { LoadQuizzies } from './load-quizzies.resolve';
import { LoadQuiz } from './load-quiz';
import { JoinQuizComponent } from './join-quiz/join-quiz.component';
import { ViewQuizComponent } from './view-quizzies/view-quiz/view-quiz.component';
import { SubmitQuizComponent } from './join-quiz/submit-quiz/submit-quiz.component';
import { ViewResultsComponent } from './join-quiz/view-results/view-results.component';
import { ViewResultsGuard } from './join-quiz/view-results.guard';
import { JoinQuizsGuard } from './join-quiz/join-quiz.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'join-quiz',
    component: JoinQuizComponent,
  },
  {
    path: 'join-quiz/:id',
    component: SubmitQuizComponent,
    canActivate: [JoinQuizsGuard]
  },
  {
    path: 'view-results',
    component: ViewResultsComponent,
    canActivate: [ViewResultsGuard]
  },
  {
    path: 'overview',
    component: OverviewComponent,
    canActivate: [AuthGuard],
    resolve: { quiz: LoadQuizzies }
  },
  {
    path: 'quiz',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'new',
        component: QuizEditComponent,
      }, {
        path: 'edit/:id',
        component: QuizEditComponent,
        resolve: { quiz: LoadQuiz }
      },
      {
        path: 'view',
        component: ViewQuizziesComponent,
        resolve: { quiz: LoadQuizzies }
      },
      {
        path: 'view/:id',
        component: ViewQuizComponent,
        resolve: { quiz: LoadQuiz }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizzieRoutingModule { }
