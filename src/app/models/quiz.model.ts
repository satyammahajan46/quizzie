export class Quiz {
  constructor(
    public name: string,
    public questions: Question[]
  ) { }


}

export interface Question {
  question: string;
  options: Options;
  answer: string;
}

export interface Options {
  OptionA: string;
  OptionB: string;
  OptionC: string;
  OptionD: string;
}

export interface QuizError {
  nameError: string;
  questions: Question[];
}
