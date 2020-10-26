import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { JoinQuizComponent } from './join-quiz/join-quiz.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: MainpageComponent, data: { animation: 'HomePage' } },
  { path: 'join-quiz', component: JoinQuizComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'quizzie',
    loadChildren: () => import('./quizzie/quizzie.module').then(m => m.QuizzieModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
