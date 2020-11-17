import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Options } from 'src/app/models/quiz.model';
import { Store } from '@ngrx/store';
import { Quiz, QuizError } from '../../models/quiz.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { AppState } from 'src/app/appStore/app.reducer';
import { editQuiz, createQuiz } from '../store/quizzie.actions';



@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizEditComponent implements OnInit, OnDestroy {
  id: string;
  editMode = false;
  quizForm: FormGroup;
  questions: FormArray;
  answerSelected: string;
  private isLoadingResult: boolean;
  options: Options[];
  serverErrors: QuizError;
  private storeSub: Subscription;
  private quiz: Quiz;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private changeDetRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.quiz = null;
  }
  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.serverErrors = null;

    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.editMode = params.id != null;
      // intialize the form for editin
      this.storeSub = this.store.select('quizzie').subscribe((quizState) => {

        this.isLoadingResult = quizState.loading;
        if (quizState.cEditError) {
          this.serverErrors = quizState.cEditError;
        }
        if (this.quizForm && quizState.isLoaded) {
          this.quizForm.enable({ emitEvent: false });
          this.parseServerError();
          this.quizForm.updateValueAndValidity();
        }
        if (this.editMode) {
          this.quiz = quizState.quizData;
        }
        this.initForm();
        this.changeDetRef.detectChanges();
      });
    });


  }
  initForm() {
    let quizname = '';
    const questions = new Array();
    if (this.editMode) {
      quizname = this.quiz.name;

      this.quiz.questions.forEach((ele) => {
        questions.push(this.createQuestionInfo(
          ele.question,
          ele.answer,
          ele.options.OptionA,
          ele.options.OptionB,
          ele.options.OptionC,
          ele.options.OptionD
        ));
      });

      // this.quizForm = this.formBuilder.group({
      //   name: [this.quiz.name, [Validators.required]],
      //   questions: this.formBuilder.array([...questions]),
      // });
      this.options = new Array<Options>();
      this.setAllOptionsList();

    }
    if (!questions.length) {
      this.quizForm = this.formBuilder.group({
        name: [quizname, [Validators.required]],
        questions: this.formBuilder.array([this.createQuestion()])
      });

    } else {
      this.quizForm = this.formBuilder.group({
        name: [quizname, [Validators.required]],
        questions: this.formBuilder.array(questions)
      });
    }
    this.options = new Array<Options>();
    this.setAllOptionsList();


    this.quizForm.get('name').valueChanges.subscribe((val) => {
      const name = this.quizForm.get('name');
      if (val && name.hasError('serverError')) {
        name.setErrors(null);
      }
    });

    this.getArrayControl().forEach((element) => {
      element.get('answer').setValue(element.get('answer').value);
      element.get('question').valueChanges.subscribe(val => {
        const ques = element.get('question');
        if (val && ques.hasError('serverError')) {
          ques.setErrors(null);
        }
      });
      element.get('answer').valueChanges.subscribe(val => {
        const ans = element.get('answer');
        if (val && ans.hasError('serverError')) {
          ans.setErrors(null);
        }
      });
      element.get('OptionA').valueChanges.subscribe(val => {
        const optA = element.get('OptionA');
        if (val && optA.hasError('serverError')) {
          optA.setErrors(null);
        }
      });
      element.get('OptionB').valueChanges.subscribe(val => {
        const optB = element.get('OptionB');
        if (val && optB.hasError('serverError')) {
          optB.setErrors(null);
        }
      });
      element.get('OptionC').valueChanges.subscribe(val => {
        const optC = element.get('OptionC');
        if (val && optC.hasError('serverError')) {
          optC.setErrors(null);
        }
      });
      element.get('OptionD').valueChanges.subscribe(val => {
        const optD = element.get('OptionD');
        if (val && optD.hasError('serverError')) {
          optD.setErrors(null);
        }
      });
    });

  }

  parseServerError() {
    if (!this.serverErrors) {
      return;
    }
    if (this.serverErrors.nameError) {
      this.quizForm.get('name').setValidators([this.serverValidator(this.serverErrors.nameError)]);
      this.quizForm.get('name').updateValueAndValidity();
    }
    if (this.serverErrors.questions) {
      const questionError = this.serverErrors.questions;
      const questionFormArray = this.getArrayControl();
      questionError.forEach((element, index) => {
        const quesErr = element.question;
        const ansErr = element.answer;
        const optErr: Options = element.options;
        const selectedQues = questionFormArray[index];
        if (quesErr) {
          selectedQues.get('question').setValidators([this.serverValidator(quesErr)]);
          selectedQues.get('question').updateValueAndValidity();
        }
        if (ansErr) {
          selectedQues.get('answer').setValidators([this.serverValidator(ansErr)]);
          selectedQues.get('answer').updateValueAndValidity();
        }
        if (optErr.OptionA) {
          selectedQues.get('OptionA').setValidators([this.serverValidator(optErr.OptionA)]);
          selectedQues.get('OptionA').updateValueAndValidity();
        }
        if (optErr.OptionB) {
          selectedQues.get('OptionB').setValidators([this.serverValidator(optErr.OptionA)]);
          selectedQues.get('OptionB').updateValueAndValidity();
        }
        if (optErr.OptionC) {
          selectedQues.get('OptionC').setValidators([this.serverValidator(optErr.OptionC)]);
          selectedQues.get('OptionC').updateValueAndValidity();
        }
        if (optErr.OptionD) {
          selectedQues.get('OptionD').setValidators([this.serverValidator(optErr.OptionD)]);
          selectedQues.get('OptionD').updateValueAndValidity();
        }
      });
    }
  }

  private serverValidator(errMsg: string) {

    return (control: AbstractControl): ValidationErrors => {
      return { serverError: errMsg };
    };
  }

  createQuestion(): FormGroup {
    return this.formBuilder.group({
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      OptionA: ['', [Validators.required]],
      OptionB: ['', [Validators.required]],
      OptionC: ['', [Validators.required]],
      OptionD: ['', [Validators.required]]
    });
  }

  createQuestionInfo(ques, ans, oA, oB, oC, oD): FormGroup {
    return this.formBuilder.group({
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

  addQuestion() {
    const index = this.getArrayControl().length;
    this.getArrayControl().push(this.createQuestion());
    this.setQptionsList(index);
  }

  onSubmit() {
    const questionControl = this.getArrayControl();
    questionControl.forEach(item => {
      item.updateValueAndValidity();
    });
    // console.log(this.quizForm);
    if (this.quizForm.invalid) {
      this.snackBar.open('Please validate your input!', '', {
        duration: 3000,
        panelClass: ['danger-pop-up-msg']
      });
      return;
    }

    if (this.quizForm.disabled) {
      this.snackBar.open('Quiz Already Created', '', {
        duration: 3000,
        panelClass: ['pop-up-msg']
      });
      return;
    }

    this.quizForm.disable({ emitEvent: false });
    if (this.editMode) {
      const quiz = new Quiz(this.quiz.id, this.quizForm.value.name, this.quizForm.value.questions);
      quiz.questions.forEach((ques, index) => {
        if (this.quiz.questions[index] && this.quiz.questions[index].id) {
          ques.id = this.quiz.questions[index].id;
        }
      });
      console.log(quiz);
      this.store.dispatch(
        editQuiz({ quiz })
      );
    } else {
      const quiz = new Quiz(null, this.quizForm.value.name, this.quizForm.value.questions);
      this.store.dispatch(
        createQuiz({ quiz })
      );
    }
  }

  onCancel() {
    this.quizForm.reset();
    if (this.editMode) {
      this.router.navigate(['../../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  getOptions(index): string[] {
    if (!this.options) {
      return [];
    }
    if (!this.options[index]) {
      return [];
    }

    const opt = [...Object.values(this.options[index])];
    // console.log(...Object.values(this.options[index]));
    return opt;

  }

  private setAllOptionsList() {

    this.getArrayControl().forEach((item, index) => {
      item.valueChanges.subscribe((val) => {
        // console.log(val);
        const modifiedVal: Options = {
          OptionA: 'Option A missing',
          OptionB: 'Option B missing',
          OptionC: 'Option C missing',
          OptionD: 'Option D missing'
        };
        Object.keys(val).forEach((key) => {
          if (key === 'OptionA' && val[key] !== '') {
            modifiedVal.OptionA = val[key];
          } else if (key === 'OptionB' && val[key] !== '') {
            modifiedVal.OptionB = val[key];
          } else if (key === 'OptionC' && val[key] !== '') {
            modifiedVal.OptionC = val[key];
          } else if (key === 'OptionD' && val[key] !== '') {
            modifiedVal.OptionD = val[key];
          }
        });
        this.options[index] = modifiedVal;
        // console.log(this.options)
        // this.getOptions(0);
      });
    });
  }


  private setQptionsList(index: number) {
    const formControl = this.getArrayControl()[index];
    formControl.valueChanges.subscribe((val) => {
      const modifiedVal: Options = {
        OptionA: 'Option A missing',
        OptionB: 'Option B missing',
        OptionC: 'Option C missing',
        OptionD: 'Option D missing'
      };
      Object.keys(val).forEach((key) => {
        if (key === 'OptionA' && val[key] !== '') {
          modifiedVal.OptionA = val[key];
        } else if (key === 'OptionB' && val[key] !== '') {
          modifiedVal.OptionB = val[key];
        } else if (key === 'OptionC' && val[key] !== '') {
          modifiedVal.OptionC = val[key];
        } else if (key === 'OptionD' && val[key] !== '') {
          modifiedVal.OptionD = val[key];
        }
      });

      this.options[index] = modifiedVal;
      // sconsole.log(this.getArrayControl());
    });
  }

  isLoading(): boolean {
    return this.isLoadingResult;
  }
}
