const express = require(`express`);
const bodyParser = require(`body-parser`);
const path = require(`path`);
const galleryRoutes = require(`./routes/gallery`);
const handlebars  = require('express-handlebars');
const passport = require(`passport`);
const LocalStrategy = require(`passport-local`);
const session = require(`express-session`);
const bcrypt = require(`bcrypt`);
const Redis = require(`connect-redis`)(session);
const {isAuthenticated} = require(`./routes/helper`)
const saltRounds = 12;

const User = require(`./db/models/User`);
const Gallery = require(`./db/models/Gallery`);
const PORT = process.env.PORT || 3000;
const app = express();
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('.hbs', handlebars({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(methodOverride('_method'));

app.use(session({
  store: new Redis(),
  secret: `keyboard cat`,
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname,'/public')));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log(`serializing`, user)
  return done(null, {
  id: user.id,
  username: user.username,
  role : user.role
   });
 });

 passport.deserializeUser((user, done) => {
  console.log(`deserializing`)
  new User({ id: user.id}).fetch()
   .then(user => {
     user = user.toJSON();
  return done(null, {
  id: user.id,
  username:user.username,
  role: user.role
     });
   });
 });

 passport.use(new LocalStrategy(function(username, password, done) {
  return new User({ username: username }).fetch()
  .then ( user => {
    user = user.toJSON();
    console.log(user)
    if (user === null) {
      return done(null, false, {message: 'bad username or password'});
    }
    else {
      console.log(password, user.password);
      bcrypt.compare(password, user.password)
      .then(res => {
        if (res) { return done(null, user); }
        else {
          return done(null, false, {message: 'bad username or password'});
        }
      });
    }
  })
  .catch(err => { console.log('error: ', err); });
}));

app.get(`/login`, (req, res) => {
  
  return res.render('./login');
})
app.post('/login', passport.authenticate('local', {
  successRedirect: '/gallery',
  failureRedirect: '/'
}));

app.get('/logout', (req, res) => {
  req.logout();
  return res.redirect(`/gallery`);
});

app.get('/register', (req, res) => {
    return res.render('./register');
  })
app.post('/register', (req, res) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) { console.log(err); }
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if (err) { console.log(err); }
      new User({
        username: req.body.username,
        password: hash
      })
      .save()
      .then( (user) => {
        console.log(user);
        return res.redirect('/gallery');
      })
      .catch((err) => { 
      return res.json({message: err.message });
      })
    })
  })
});

app.get('/secret', isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user id', req.user.id);
  console.log('req.username', req.user.username);
  res.send('you found the secret!');
});

app.get('/', (req, res) => {
  return res.redirect('/gallery');
});

app.use(`/gallery`, galleryRoutes);
app.get(`/success`, (req, res) => {
  res.send(`success`)
})

app.listen(PORT, () => {
  console.log(`Server Listening On Port: ${PORT}`);
})