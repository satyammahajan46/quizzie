import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { QuizEditComponent } from './quiz-edit/quiz-edit.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  { path: 'overview', component: OverviewComponent },
  {
    path: 'quiz',
    children: [
      { path: 'new', component: QuizEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizzieRoutingModule { }
