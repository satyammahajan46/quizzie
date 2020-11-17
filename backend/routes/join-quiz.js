const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const joinQuizController = require("../controllers/join-quiz");

const router = express.Router();

router.get("/:pin", joinQuizController.getJoinQuiz);

router.get("/quiz-stat/:id", isAuth, joinQuizController.getAllStats);

router.post(
  "/submitquiz",
  [
    body("name").trim().notEmpty().withMessage("Required Field"),
    body("quizID").trim().notEmpty().withMessage("Required Field"),
    body("questions")
      .isArray({ min: 1 })
      .custom((val, { req }) => {
        const errors = new Array();
        let isValid = true;
        Object.entries(val).forEach((question, index) => {
          errors[index] = new Array();
          if (!question[1].questionID) {
            errors[index].push({
              error: "Missing question from quiz",
              param: "question",
            });
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
  joinQuizController.submitQuiz
);

module.exports = router;
