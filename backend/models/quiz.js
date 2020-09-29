const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

module.exports = mongoose.model("Quiz", userSchema);
