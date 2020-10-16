const { validationResult } = require("express-validator/check");

const User = require("../models/user");

const Quiz = require("../models/quiz");

const Question = require("../models/question");

const mongoose = require("mongoose");

exports.getQuizzies = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.pp || 5;
  const questions = req.query.q || 0;
  try {
    const user = req.userId;
    const totalQuiz = await Quiz.find({ userID: user }).countDocuments();
    let quizzies;
    if (questions) {
      quizzies = await Quiz.find({ userID: user })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else {
      quizzies = await Quiz.find({ userID: user })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .populate({ path: "questions", options: { limit: 1 } });
    }
    if (!quizzies.length) {
      const error = new Error("No quizzies found!");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Fetched quizzies successfully.",
      quizzies: quizzies,
      totalItems: totalQuiz,
    });
  } catch (err) {
    const error = new Error("Unknown error occured");
    error.statusCode = 500;
    error.data = err;
    next(error);
  }
};

exports.createQuiz = async (req, res, next) => {
  const errors = validationResult(req);
  try {
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
    const questions = req.body.questions;
    const user = req.userId;
    // console.log(questions);
    const name = req.body.name;
    const quiz = await Quiz.create({
      userID: user,
      name: name,
      questions: [],
    });
    const quizID = quiz._id;
    const questionsID = new Array();

    for (const value of questions) {
      const question = await Question.create({
        question: value.question,
        options: [value.OptionA, value.OptionB, value.OptionC, value.OptionD],
        answer: value.answer,
        quizID: quizID,
      });
      questionsID.push(question._id);
    }
    const result = await quiz.updateOne({ questions: [...questionsID] });

    const updateUser = await User.findById(user).updateOne({
      $push: { quiz: quizID },
    });
    if (result && updateUser) {
      res.status(200).json({
        message: "quiz created",
        _id: quizID,
      });
    } else {
      throw new Error("Unknown Error");
    }
  } catch (err) {
    next(err);
  }
};

exports.getQuiz = async (req, res, next) => {
  try {
    const quizID = req.params.quizID;
    const user = req.userId;
    const quiz = await Quiz.findOne({
      $and: [{ _id: quizID }, { userID: user }],
    }).populate("questions");

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

exports.updateQuiz = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    next(err);
  }

  try {
    const quizID = req.params.quizID;
    const user = req.userId;
    const name = req.body.name;
    const questions = req.body.questions;
    const quiz = await Quiz.findOne({
      $and: [{ _id: quizID }, { userID: user }],
    });
    if (!quiz) {
      const error = new Error("No quiz found");
      error.statusCode = 404;
      return next(error);
    }

    let result = await Quiz.updateOne(
      { $and: [{ _id: quizID }, { userID: user }] },
      { name: name }
    );
    const questionsID = new Array();

    let removeQuestions = [...(await quiz).toObject().questions];

    for (const value of questions) {
      if (value._id) {
        await Question.findByIdAndUpdate(value._id, {
          question: value.question,
          options: [value.OptionA, value.OptionB, value.OptionC, value.OptionD],
          answer: value.answer,
        });
        questionsID.push(value._id);
        removeQuestions = removeQuestions.filter(
          (element) => element.toString() !== value._id.toString()
        );
      } else {
        const ques = await Question.create({
          question: value.question,
          options: [value.OptionA, value.OptionB, value.OptionC, value.OptionD],
          answer: value.answer,
          quizID: quizID,
        });
        questionsID.push(ques._id);
        removeQuestions = removeQuestions.filter(
          (element) => element.toString() !== ques._id.toString()
        );
      }
    }
    for (const element of removeQuestions) {
      await Question.findByIdAndDelete(element);
    }
    result = await quiz.updateOne({ questions: [...questionsID] });
    if (result) {
      res.status(200).json({
        message: "quiz updated",
        _id: quizID,
      });
    } else {
      throw new Error("Unknown Error");
    }
  } catch (err) {
    const error = new Error("Unknown error occured");
    error.statusCode = 500;
    error.data = err;
    next(error);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const quizID = req.params.quizID;
    const user = req.userId;
    const quiz = await Quiz.findOne({
      $and: [{ _id: quizID }, { userID: user }],
    });
    if (!quiz) {
      const error = new Error("No quiz found");
      error.statusCode = 404;
      return next(error);
    }

    const questionsID = (await quiz).toObject().questions;
    for (const value of questionsID) {
      await Question.findByIdAndDelete(value._id);
    }

    let result = (await quiz).deleteOne();

    result = await User.findById(user).quiz.pull(quizID);

    if (result) {
      res.status(200).json({
        message: "quiz deleted",
      });
    } else {
      throw new Error("Unknown Error");
    }
  } catch (err) {
    const error = new Error("Unknown error occured");
    error.statusCode = 500;
    error.data = err;
    next(error);
  }
};
