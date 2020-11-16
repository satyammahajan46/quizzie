const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    quizID: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
    correctAnswer: {
      type: Number,
      required: true,
    },

    correctAnswersID: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    totalQues: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stats", statSchema);
