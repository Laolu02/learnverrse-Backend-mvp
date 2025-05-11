import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../model/user.model.js';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await UserModel.findOne({ email: profile.emails[0].value });
      
      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = await UserModel.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        profilePicture: profile.photos[0]?.value,
        role: 'user'
      });

      return done(null, newUser);
    }
  )
);

export default passport;