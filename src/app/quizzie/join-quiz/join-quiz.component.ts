import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../appStore/app.reducer';

@Component({
  selector: 'app-join-quiz',
  templateUrl: './join-quiz.component.html',
  styleUrls: ['./join-quiz.component.css']
})
export class JoinQuizComponent implements OnInit {

  quizName: string;
  isValid: boolean;
  quizPinForm: FormGroup;

  nameForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {
    this.quizName = 'Loading...';
  }

  ngOnInit(): void {
    this.quizPinForm = this.formBuilder.group({
      pin: ['', [Validators.required]]
    });
    this.nameForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  onSubmit() {
    const quizPin = this.quizPinForm.value.pin;
    const name = this.nameForm.value.name;
    console.log(quizPin + ' ' + name);
  }
}
