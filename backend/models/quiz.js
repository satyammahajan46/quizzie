const { text } = require("express");
const mongoose = require("mongoose");
const { stringify } = require("querystring");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
