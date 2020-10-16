export class Quiz {
  constructor(
    public id: string,
    public name: string,
    public questions: Question[]
  ) { }


}

export interface Question {
  id?: string;
  question: string;
  options: Options;
  answer?: string;
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
