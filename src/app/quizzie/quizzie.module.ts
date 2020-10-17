import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuizzieRoutingModule } from './quizzie-routing.module';
import { QuizEditComponent } from './quiz-edit/quiz-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatFormFieldModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { EffectsModule } from '@ngrx/effects';
import { QuizzieEffects } from './store/quizzie.effects';
import { ViewQuizziesComponent } from './view-quizzies/view-quizzies.component';




@NgModule({
  declarations: [OverviewComponent, QuizEditComponent, ViewQuizziesComponent],
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
    MatExpansionModule,
    MatRadioModule,
    MatPaginatorModule,
    EffectsModule.forFeature([QuizzieEffects])
  ]
})
export class QuizzieModule { }
