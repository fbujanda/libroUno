const express = require("express");
const route = express.Router();
const passport = require("passport");
const user = require("../models/user");
// ruta principal
route.get("/", (req, res, next) => {
  res.render("index");
});
//Página de registro (primera vez)
route.get("/signup", (req, res, next) => {
  res.render("signup");
});
//Página de registro envío del formulario
route.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    passReqToCallback: true,
  })
);
//Página de ingreso
route.get("/signin", (req, res, next) => {
  res.render("signin");
});
//Página de ingreso envío del formulario
route.post(
  "/signin",
  passport.authenticate("local-signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    passReqToCallback: true,
  })
);
route.get("/logout", (req, res, next) => {
  req.logOut(() => {});
  res.redirect("/");
});
// Profile
route.get("/profile", isAuthenticated, (req, res, next) => {
  res.render("profile");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.autorizado) {
    return next();
  }
  res.redirect("/");
}

module.exports = route;
