require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

//database connection
const DB_URL =
  "mongodb+srv://Kumuthu:omega123@cluster0.ehhq0.mongodb.net/influencer_hub?retryWrites=true&w=majority";

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log("DB connection error", err));

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("uploads"));

//set template engine
app.set("view engine", "ejs");

// route prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
