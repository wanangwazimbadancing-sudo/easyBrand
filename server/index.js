const express = require('express');
const dotenv =require("dotenv").config();
const session = require('express-session');
const passport = require('passport');
require('./services/passport');
const bcrypt = require('bcrypt');
const { users } = require('./services/db');
const { Authenticate } = require('./middlewares/auth');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());


// routes

     // --- register route ---

app.post('/register', async (req, res) => {
  const { username,email, password } = req.body;
try {

    if (!username || !email || !password) {
        return res.status(422).json({ message: 'Username, email and password are required' });
    }
    if(await users.findOne({ email })) {
        return res.status(409).json({ message: 'Email already exists' });
    }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await users.insert({ username, email, password: hashedPassword });
  
  res.status(201).json({ id: newUser._id, message: 'User registered', user: newUser });

}catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
}
});



  //--- login route ---

  app.post('/login', async (req, res) => {
passport.authenticate('local', (err, user, info) => {
    if(err){
        return res.status(500).json({ message: 'something went wrong' });
    }

    if(!user){
        return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {

        if(err){
            return res.status(500).json({ message: 'something went wrong' });
        }

    return    res.status(200).json({ message: 'Login successful',id: user._id, user: user.name, email: user.email });
    }

    );
})(req, res);

  });

app.get("/me", Authenticate, (req, res) => {
    res.status(200).json({message:"welcome", user: req?.user, email: req?.email?.email, id: req._id });
});




app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))




app.get("/logout",
     (req,res)=>{
 req.logOut(

    (err)=>{
      if(err)return res.status(500).json({err:"something went wrong"})
       
        res.status(201).send("logged out successfully");
    }

 )


     }

)

  app.listen(3000, () => {
  console.log('Server is running on port 3000');
});