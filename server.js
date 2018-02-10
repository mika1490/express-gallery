const express = require(`express`);
const bodyParser = require(`body-parser`);

const galleryRoutes = require(`./routes/gallery`);
const handlebars  = require('express-handlebars');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(`/gallery`, galleryRoutes);
// app.get(`/`, (req, res) => {
//   res.send(`Smoke Test`);
// })
app.listen(PORT, () => {
  console.log(`Server Listening On Port: ${PORT}`);
 })