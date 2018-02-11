const express = require(`express`);
const bodyParser = require(`body-parser`);
const path = require(`path`);
const galleryRoutes = require(`./routes/gallery`);
const handlebars  = require('express-handlebars');

const PORT = process.env.PORT || 3000;
const app = express();
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('.hbs', handlebars({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(methodOverride('_method'));

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(`/gallery`, galleryRoutes);

// app.get(`/`, (req, res) => {
//   res.send(`Smoke Test`);
// })

app.listen(PORT, () => {
  console.log(`Server Listening On Port: ${PORT}`);
 })