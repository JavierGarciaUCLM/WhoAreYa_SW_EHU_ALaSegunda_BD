const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Estrategia Google OAuth (solo si está configurada)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });
          
          if (!user) {
            const isFirstAccount = (await User.countDocuments()) === 0;
            user = new User({
              name: profile.name.givenName,
              lastName: profile.name.familyName || "",
              email: profile.emails[0].value,
              password: "", //OAuth no requiere password
              role: isFirstAccount ? "admin" : "user"
            });
            await user.save();
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log("[OAuth] Google OAuth configurado");
} else {
  console.log("[OAuth] Google OAuth no configurado (falta GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET)");
}

// Estrategia GitHub OAuth (solo si está configurada)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //GitHub puede no tener email público, usar username como fallback
          const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
          let user = await User.findOne({ email }); //como en clase, busco por email
          
          if (!user) {
            const isFirstAccount = (await User.countDocuments()) === 0;
            const nameParts = profile.displayName?.split(" ") || [profile.username];
            user = new User({
              name: nameParts[0] || profile.username,
              lastName: nameParts.slice(1).join(" ") || "",
              email: email,
              password: "",// OAuth no requiere password
              role: isFirstAccount ? "admin" : "user"
            });
            await user.save();
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log("[OAuth] GitHub OAuth configurado");
} else {
  console.log("[OAuth] GitHub OAuth no configurado (falta GITHUB_CLIENT_ID o GITHUB_CLIENT_SECRET)");
}

module.exports = passport;

