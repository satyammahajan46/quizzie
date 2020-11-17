const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Stat = require("../models/stats");

const { validationResult } = require("express-validator/check");
const { Stats } = require("fs");

exports.submitQuiz = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
  } catch (err) {
    next(err);
  }

  try {
    const quizID = req.body.quizID;
    const name = req.body.name;
    const questions = req.body.questions;

    // console.log(quizID);

    // console.log(name);
    // console.log(questions);

    const quiz = await Quiz.findOne({ _id: quizID });

    // console.log(quiz);
    let rightAnswer = 0;
    const totalQuestions = quiz.questions.length;

    const correctAnswer = new Array();

    for (const value of questions) {
      const question = await Question.findOne({
        _id: value.questionID,
      });

      if (!question) {
        const error = new Error("Question doesn't exist");
        error.statusCode = 400;
        error.data = { questionID: value.questionID };
        return next(error);
      }

      if (question.quizID.toString() === quizID.toString()) {
        if (
          question.answer.toString().trim() === value.answer.toString().trim()
        ) {
          rightAnswer++;
          correctAnswer.push(value.questionID);
        }
      } else {
        const error = new Error("Invalid question");
        error.statusCode = 400;
        return next(error);
      }
    }

    const stat = await Stat.create({
      name: name,
      quizID: quizID,
      correctAnswer: rightAnswer,
      totalQues: totalQuestions,
      correctAnswersID: [...correctAnswer],
    });

    await quiz.updateOne({ $push: { statID: stat._id } });
    res.status(200).json({
      message: "Here is your requested data",
      stat: stat,
    });
  } catch (err) {
    const error = new Error("Unknown error occured");
    error.statusCode = 500;
    error.data = err;
    next(error);
  }
};

exports.getJoinQuiz = async (req, res, next) => {
  try {
    const pin = req.params.pin;
    const quiz = await Quiz.findOne({
      $and: [{ joinID: pin }],
    }).populate({ path: "questions", select: "-answer" });

    if (!quiz) {
      const error = new Error("No quiz found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Here is your requested data",
      quiz: quiz,
    });
  } catch (err) {
    const error = new Error("Unknown error occured");
    error.statusCode = 500;
    error.data = err;
    next(error);
  }
};

exports.getAllStats = async (req, res, next) => {
  try {
    const user = req.userId;
    const quizID = req.params.id;
    const quiz = await Quiz.findOne({
      $and: [{ _id: quizID }, { userID: user }],
    }).populate("statID");

    if (!quiz) {
      const error = new Error("No quizzies found!");
      error.statusCode = 404;
      return next(error);
    }

    const statsItems = quiz.statID.length;

    if (!statsItems) {
      return res.json({
        message: "no stats available",
        totalItems: statsItems,
        stats: [],
      });
    } else {
      return res.json({
        message: "Here is your requested data",
        totalItems: statsItems,
        stats: quiz.statID,
      });
    }
  } catch (err) {
    const error = new Error("Unknown error occured");
    error.statusCode = 500;
    error.data = err;
    next(error);
  }
};
