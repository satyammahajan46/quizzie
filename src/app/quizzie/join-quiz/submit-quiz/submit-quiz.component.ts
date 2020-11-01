import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, selectQuizzieQuiz } from 'src/app/appStore/app.reducer';
import { Quiz } from 'src/app/models/quiz.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-submit-quiz',
  templateUrl: './submit-quiz.component.html',
  styleUrls: ['./submit-quiz.component.css']
})
export class SubmitQuizComponent implements OnInit, OnDestroy {

  private storeSub: Subscription;
  quiz: Quiz;
  name: string;
  quizForm: FormGroup;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {

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
  }

  ngOnInit(): void {
    this.storeSub = this.store.select(selectQuizzieQuiz).subscribe(q => {
      this.quiz = q;
      console.log(q);
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
    console.log(this.quizForm);

  }
}
