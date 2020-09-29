import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';

interface Options {
  OptionA: string;
  OptionB: string;
  OptionC: string;
  OptionD: string;
}

@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizEditComponent implements OnInit {
  id: string;
  editMode = false;
  quizForm: FormGroup;
  questions: FormArray;
  answerSelected: string;

  options: Options[];
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.editMode = params.id != null;
      // intialize the form for editing
      // this.initForm();
    });

    // let question = new FormArray([]);
    this.quizForm = this.formBuilder.group({
      questions: this.formBuilder.array([this.createQuestion()])

    });

    // this.quizForm.get('questions').valueChanges.subscribe((val) => {
    //   console.log(val);
    //   val.forEach(item => {
    //     this.options[0] = item.OptionA;
    //     this.options[1] = item.OptionB;
    //     this.options[2] = item.OptionC;
    //     this.options[3] = item.OptionD;
    //   });
    // });

    this.options = new Array<Options>();
    this.setAllOptionsList();

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

  getArrayControl() {
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

    if (this.quizForm.invalid) {
      return;
    }
    // TODO: CREATE CONNECT WITH BACKEND USE STORE
    // this.store.dispatch(
    //   AuthActions.login({
    //     userEmail: this.quizForm.value.email,
    //     password: this.signInform.value.password
    //   })
    // );
    console.log(JSON.stringify(this.quizForm.value));
  }

  onCancel() {
    this.quizForm.reset();
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  getOptions(index): string[] {
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
}
