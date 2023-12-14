import passport from "passport";
import { userRepository } from "./services/repository/users.repository.js";
import { cartRepository } from "./services/repository/carts.repository.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { hashData, compareData } from "./utils.js";
import { confEnv } from "./config.js";

// -------------- Local ----------------
passport.use(
  "signup",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      const { first_name, last_name } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return done(null, false, { message: "All fields are required" });
      }

      const cart = await cartRepository.createOne();

      try {
        const hashPassword = await hashData(password);
        const createdUser = await userRepository.createOne({
          ...req.body,
          password: hashPassword,
          cart: cart._id,
          // role: "admin",
        });

        return done(null, createdUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      if (!email || !password) {
        return done(null, false, { message: "All fields are required" });
      }

      try {
        const user = await userRepository.findByEmail(email);
        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// -------------- JWT ----------------
const fromCookies = (req) => {
  return req.cookies.token;
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
  secretOrKey: confEnv.TOKEN_SECRET_JWT,
};

passport.use(
  "current",
  new JWTStrategy(jwtOptions, (jwt_payload, done) => {
    try {
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  })
);

// -------------- GitHub ----------------
passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: confEnv.GITHUB_CLIENT_ID,
      clientSecret: confEnv.GITHUB_CLIENT_SECRET,
      callbackURL: confEnv.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("GITHUB ---> ", profile);
      try {
        const userDB = await userRepository.findByEmail(profile._json.email);
        // Login
        if (userDB) {
          if (userDB.isGithub) {
            return done(null, userDB);
          } else {
            return done(null, false);
          }
        }

        const cart = await cartRepository.createOne();

        // Signup
        const infoUser = {
          first_name: profile._json.name.split(" ")[0],
          last_name: profile._json.name.split(" ")[1],
          email: profile._json.email,
          password: "",
          isGithub: true,
          cart: cart._id,
        };

        const createUser = await userRepository.createOne(infoUser);
        done(null, createUser);
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});
