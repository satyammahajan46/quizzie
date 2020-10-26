const { text } = require("express");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

quizSchema.plugin(autoIncrement.plugin, {
  model: "Quiz",
  field: "joinID",
  startAt: 100000,
});
module.exports = mongoose.model("Quiz", quizSchema);
