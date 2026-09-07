const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require('bcrypt');
const { users } = require('./db');


passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await users.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// google strategy

passport.use(new GoogleStrategy({
  clientID:process.env.CLIENT_ID,
  clientSecret:process.env.CLIENT_SECRET,
  callbackURL:process.env.CALLBACK_URL
},
 async (accessToken,refreshToken,profile,done)=>{

try {
  const user = await users.findOne({googleId: profile.id});
if(user){
  return done(null,user);


}

const newUser = await users.insert({
 googleId: profile.id,
  name: profile.displayName,
 email:profile.emails[0].value,
  
})

done(null,newUser);

  
} catch (error) {
  done(error)
}

 }
))



passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findOne({ _id: id });

    if (!user) {
      return done(new Error('Something went wrong, try again later.'));
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});