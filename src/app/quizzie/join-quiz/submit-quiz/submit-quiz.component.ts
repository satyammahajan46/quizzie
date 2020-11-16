import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, selectQuizzieQuiz } from 'src/app/appStore/app.reducer';
import { Quiz } from 'src/app/models/quiz.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isLoadedQuizzie } from '../../../appStore/app.reducer';
import { submitQuiz } from '../../store/quizzie.actions';

@Component({
  selector: 'app-submit-quiz',
  templateUrl: './submit-quiz.component.html',
  styleUrls: ['./submit-quiz.component.css']
})
export class SubmitQuizComponent implements OnInit, OnDestroy {

  private storeSub: Subscription;
  private isLoadedSub: Subscription;
  quiz: Quiz;
  name: string;
  quizForm: FormGroup;
  isLoaded: boolean;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.isLoaded = false;

    if (this.router.getCurrentNavigation().extras.state.fullname) {
      // this.quizForm.get('name').setValue(this.router.getCurrentNavigation().extras.state.fullname);
      this.name = this.router.getCurrentNavigation().extras.state.fullname;
    } else {
      this.name = 'Anonymous';
      // this.quizForm.get('name').setValue('Anonymous');
    }
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    if (this.isLoadedSub) {
      this.isLoadedSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.storeSub = this.store.select(selectQuizzieQuiz).subscribe(q => {
      this.quiz = q;
    });

    this.isLoadedSub = this.store.select(isLoadedQuizzie).subscribe(isLoaded => {
      this.isLoaded = isLoaded;
    });

    this.initForm();
  }

  initForm() {
    const questions = new Array();

    this.quiz.questions.forEach((ele) => {
      questions.push(this.createQuestionInfo(
        ele.id,
        ele.question,
        '',
        ele.options.OptionA,
        ele.options.OptionB,
        ele.options.OptionC,
        ele.options.OptionD
      ));
    });

    this.quizForm = this.formBuilder.group({
      name: [this.quiz.name, [Validators.required]],
      questions: this.formBuilder.array(questions)
    });

  }

  createQuestionInfo(quesID, ques, ans, oA, oB, oC, oD): FormGroup {
    return this.formBuilder.group({
      questionID: [quesID, [Validators.required]],
      question: [ques, [Validators.required]],
      answer: [ans, [Validators.required]],
      OptionA: [oA, [Validators.required]],
      OptionB: [oB, [Validators.required]],
      OptionC: [oC, [Validators.required]],
      OptionD: [oD, [Validators.required]]
    });
  }

  getArrayControl() {
    if (!this.quizForm) {
      return [];
    }
    return (this.quizForm.get('questions') as FormArray).controls;
  }



  onCancel() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    this.quizForm.get('name').setValue(this.name);

    this.getArrayControl().forEach(ele => {
      ele.markAsTouched();
    });

    if (this.quizForm.valid) {
      // send form data to back end

      this.quizForm.disable();
      this.store.dispatch(submitQuiz({
        name: this.quizForm.get('name').value,
        quizID: this.quiz.id,
        questions: this.quizForm.get('questions').value
      }));
    }

  }
}
