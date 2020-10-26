import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { QuizEditComponent } from './quiz-edit/quiz-edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { ViewQuizziesComponent } from './view-quizzies/view-quizzies.component';
import { LoadQuizzies } from './load-quizzies.resolve';
import { LoadQuiz } from './load-quiz';
import { JoinQuizComponent } from './join-quiz/join-quiz.component';


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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizzieRoutingModule { }
