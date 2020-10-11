const express = require("express");
const { body } = require("express-validator/check");

const quizzieController = require("../controllers/quizzie");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /quiziie/quizzies
router.get("/quizzies", quizzieController.getQuizzies);

// POST /quizzie/createQuiz
router.post(
  "/createquiz",
  isAuth,
  [
    body("name").notEmpty().withMessage("Required Field"),
    body("questions")
      .isArray({ min: 1 })
      .custom((val, { req }) => {
        const errors = new Array();
        let isValid = true;
        Object.entries(val).forEach((question, index) => {
          errors[index] = new Array();
          if (!question[1].question) {
            errors[index].push({ error: "Required field", param: "question" });
            isValid = false;
          }
          if (!question[1].OptionA) {
            errors[index].push({ error: "Required field", param: "OptionA" });
            isValid = false;
          }
          if (!question[1].OptionB) {
            errors[index].push({ error: "Required field", param: "OptionB" });
            isValid = false;
          }
          if (!question[1].OptionC) {
            errors[index].push({ error: "Required field", param: "OptionC" });
            isValid = false;
          }
          if (!question[1].OptionD) {
            errors[index].push({ error: "Required field", param: "OptionD" });
            isValid = false;
          }
          if (!question[1].answer) {
            errors[index].push({ error: "Required field", param: "answer" });
            isValid = false;
          }
        });
        if (isValid) {
          return val;
        } else {
          throw errors;
        }
      }),
  ],
  quizzieController.createQuiz
);

router.get("/quiz/:quizID", isAuth,quizzieController.getQuiz);

router.put(
  "/quiz/:quizID",
  isAuth,
  [
    body("name").notEmpty().withMessage("Required Field"),
    body("questions")
      .isArray({ min: 1 })
      .custom((val, { req }) => {
        const errors = new Array();
        let isValid = true;
        Object.entries(val).forEach((question, index) => {
          errors[index] = new Array();
          if (!question[1].question) {
            errors[index].push({ error: "Required field", param: "question" });
            isValid = false;
          }
          if (!question[1].OptionA) {
            errors[index].push({ error: "Required field", param: "OptionA" });
            isValid = false;
          }
          if (!question[1].OptionB) {
            errors[index].push({ error: "Required field", param: "OptionB" });
            isValid = false;
          }
          if (!question[1].OptionC) {
            errors[index].push({ error: "Required field", param: "OptionC" });
            isValid = false;
          }
          if (!question[1].OptionD) {
            errors[index].push({ error: "Required field", param: "OptionD" });
            isValid = false;
          }
          if (!question[1].answer) {
            errors[index].push({ error: "Required field", param: "answer" });
            isValid = false;
          }
        });
        if (isValid) {
          return val;
        } else {
          throw errors;
        }
      }),
  ],
  quizzieController.updateQuiz
);

router.delete("/quiz/:quizID", isAuth, quizzieController.deleteQuiz);

module.exports = router;
