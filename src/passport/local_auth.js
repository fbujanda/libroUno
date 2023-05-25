const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const User = require("../models/user");
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
// Nuevo ingreso
passport.use(
  "local-signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      //autorizadoField: false,
      // transferField: '1234',
      // authField: false,
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (await User.findOne({ email: email })) {
        return done(
          null,
          false,
          req.flash("signUpMssg", "Email is already taken")
        );
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.autorizado = false;
        await newUser.save();
        done(null, newUser, req.flash("signUpMssg", "Comuniquese con autor"));
      }
    }
  )
);
// Usuario regular
passport.use(
  "local-signin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      //autorizadoField: false,
      // transferField: '1234',
      // authField: false,
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, req.flash("signInMssg", "User not found"));
      }
      if (!user.comparePassword(password)) {
        return done(null, false, req.flash("signInMssg", "Password incorrect"));
      }
      if (!user.autorizado) {
        return done(
          null,
          false,
          req.flash(
            "signInMssg",
            "Contribución 3$. Comuníquese con @febafebril : fidiasbujanda@gmail.com"
          )
        );
      }

      done(null, user);
    }
  )
);
