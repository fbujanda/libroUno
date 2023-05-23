const express = require("express");

const engine = require("ejs-mate");
const path = require("path");
// const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

// Previo. Iniciación
const app = express();
require("./database");
require("./passport/local_auth");
require("dotenv").config();

// Configuracion
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");
//app.set("port", process.env.PORT || 3000);

// Middleware . Morgan explicita las peticiones al servidor
// app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "feba",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  app.locals.signUpMssg = req.flash("signUpMssg");
  app.locals.signInMssg = req.flash("signInMssg");
  app.locals.user = req.user;
  next();
});

// Routes
app.use("/", require("./routes/index.js"));

// Express static
app.use(express.static(path.join(__dirname, "public")));
// Variables de entorno para heroku
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;
// Initializing the server
app.listen(port, host, () => {
  console.log("Escuchando el puerto: ", port);
});
