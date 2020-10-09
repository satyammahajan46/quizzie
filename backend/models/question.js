const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  answer: {
    type: String,
    required: true,
  },

  quizID: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
  },
});

module.exports = mongoose.model("Question", questionSchema);
