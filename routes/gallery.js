
const express = require(`express`);

const Gallery = require(`../db/models/Gallery`);

const handlebars = require('express-handlebars');

const router = express.Router();

router.get('/new', (req, res) => {
  return res.render('new');
})
router.route(`/`)
  .post((req, res) => {
    let { author, link, description } = req.body;
    return new Gallery({ author, link, description })
      .save()
      .then(image => {
        return res.redirect(`/gallery`)
      })
      .catch(err => {
        return res.json({ message: err.message });
      })
  })
  .get((req, res) => {
    return Gallery
      .fetchAll()
      .then(image => {
        let imageArray = image.models.map((element) => {
          return element.attributes;
        })
        let locals = {
          db: imageArray
        }
        return res.render(`gallery`, locals)
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  })

router.route(`/:id`)
  .get((req, res) => {
    return new Gallery()
      .where({ id: req.params.id })
      .fetch()
      .then(image => {
        if (!image) {
          return res.redirect('/gallery')
          // throw new Error(`Image Not Found`);
        } else {
          let singleImage = image.attributes;
          console.log(singleImage)
          return res.render(`singleimage`, singleImage)
        }
      })
      .catch(err => {
        return res.redirect(`/gallery`)
      })
  })
  .put((req, res) => {
    let { author, link, description } = req.body;
    let id = req.params.id;
    return new Gallery({ id: id })
      .save({ author, link, description })
      .then(image => {
        return res.redirect(`/gallery/${id}`)
      })
      .catch(err => {
        return res.redirect(`/gallery/${id}/edit`)
      })
  })
  .delete((req, res) => {
    let id = req.params.id;
    return Gallery
      .where({ id: id })
      .destroy()
      .then(image => {
        res.redirect(`/gallery`)
      })
      .catch(err => {
        res.redirect(`/gallery/${id}`)
      })
  })

router.route(`/:id/edit`)
  .get((req, res) => {
    return new Gallery({ id: req.params.id })
      .fetch()
      .then(image => {
        let editImage = image.attributes;
        res.render(`edit`, editImage)
      })
  })

module.exports = router;