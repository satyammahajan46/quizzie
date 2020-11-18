const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const sslRedirect = require("heroku-ssl-redirect");

const authRoutes = require("./routes/auth");

const quizzieRoutes = require("./routes/quizzie");

const joinQuizRoutes = require("./routes/join-quiz");

const app = express();

app.use(sslRedirect());

mongoose
  .connect(process.env.CONNECT_URI, { useFindAndModify: false })
  .then((result) => {
    console.log("Connection established with database");
  })
  .catch((err) => console.log(err));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use("/", express.static(path.join(__dirname, "quizApp")));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.use("/api/auth", authRoutes);

app.use("/api/quizzie", quizzieRoutes);

app.use("/api/join-quiz", joinQuizRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "quizApp", "index.html"));
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

module.exports = app;
