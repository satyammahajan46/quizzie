import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuizzieRoutingModule } from './quizzie-routing.module';
import { QuizEditComponent } from './quiz-edit/quiz-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatProgressSpinnerModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { EffectsModule } from '@ngrx/effects';
import { QuizzieEffects } from './store/quizzie.effects';




@NgModule({
  declarations: [OverviewComponent, QuizEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuizzieRoutingModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    EffectsModule.forFeature([QuizzieEffects])
  ]
})
export class QuizzieModule { }
