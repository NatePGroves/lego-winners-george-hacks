require("dotenv").config();

const express = require("express");
const { connectDB } = require("./database");

const port = 3000;

// routers
const indexRouter = require("./routes/index");

const app = express();

// * session things:
// let session = require("express-session");

// // https://expressjs.com/en/resources/middleware/session.html
// app.use(
//   session({
//     name: `test`,
//     secret: "secret goes here", // eventually put this in .env, do we even need this?
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // Force HTTPS, off for development since localhost isn't that
//       maxAge: 6000000, // 100 mins
//     },
//   }),
// );

// * express-session is a browser cookie-based session management
// it stores cookies in the user's browser and keeps session data in memory/storage on the server
// tracks if a user has an active browser session
// this is automatically managed by express

// This allows your HTML to link to /bootstrap/css/...
// app.use(
//   "/bootstrap",
//   express.static(__dirname + "/node_modules/bootstrap/dist/"),
// );

connectDB(); // Connect to the database

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data

// Routes
app.use("/", indexRouter);

app.listen(process.env.PORT || port, () =>
  console.log(`Server listening at http://localhost:${port}`),
);
