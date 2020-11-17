export class Stat {
  constructor(
    public id: string,
    public name: string,
    public quizID: string,
    public correctAnswers: number,
    public correctAnswerID: string[],
    public totalQuestions: number
  ) { }


}

