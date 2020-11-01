import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitQuizComponent } from './submit-quiz.component';

describe('SubmitQuizComponent', () => {
  let component: SubmitQuizComponent;
  let fixture: ComponentFixture<SubmitQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
