import bcryptjs from 'bcryptjs';
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(
    {
     usernameField : "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        // if (!isUserExist) {
        //   return done(null, false, { message: "User Does Not Exist" });
        // }

        if(!isUserExist){
          return done("User Does Not Exist")
        }
        const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider=="google");
        // if(isGoogleAuthenticated){
        //   return done(null, false, {message: "You have authenticated through Google. So if you want to login Credentials, then at first login with google and set a password for your Gmail and then you can login with email and password."})
        // }
        if(isGoogleAuthenticated && !isUserExist.password){
          return done("You have authenticated through Google. So if you want to login Credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.")
        }
        const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);
        if(!isPasswordMatched){
          return done(null, false, {message: "Password does not matched"})
        }
        return done(null, isUserExist)
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auth: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        console.log("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
