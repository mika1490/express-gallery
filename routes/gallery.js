
const express = require(`express`);

const Gallery = require(`../db/models/Gallery`);

const User = require(`../db/models/User`);

const handlebars = require('express-handlebars');

const router = express.Router();

const {isAuthenticated} = require(`./helper`);

router.get('/new', (req, res) => {
  return res.render('./new');
})

router.route(`/`)
  .post(isAuthenticated, (req, res) => {
    let data = { author, link, description } = req.body;
    data.user_id = req.user.id;
    return new Gallery(data)
      .save()
      .then(image => {
        return res.redirect(`/gallery`)
      })
      .catch(err => {
        return res.redirect('/error');
      })
  })
  .get((req, res) => {
    return Gallery
    .fetchAll({withRelated: [`user`]})
      .then(image => {
        // let imageArray = image.models.map((element) => {
        //   return element.attributes;
        // })
        // let locals = {
        //   db: imageArray
        // }
        let images = image.toJSON();
        let locals = {
          db: images
        }
        console.log('BBBBBB', images[0])
        return res.render(`./gallery`, images[0])
      })
      .catch(err => {
        return res.json({ message: err.message });
      })
  })

router.route(`/:id`)
  .get((req, res) => {
    return new Gallery()
      .where({ id: req.params.id })
      .fetch({withRelated: [`user`]})
      .then(image => {
        if (!image) {
          return res.redirect('/gallery')
        } else {
          let singleImage = image.toJSON();
          return res.render(`./singleimage`, singleImage)
        }
      })
      .catch(err => {
        console.log(`nnn`, err)
        return res.redirect(`/gallery`)
      })
  })
  .put(isAuthenticated, (req, res) => {
    let { author, link, description } = req.body;
    let id = req.params.id;
    return new Gallery({id: id})
      .save({ author, link, description })
      .then(image => {
        return res.redirect(`/gallery/${id}`)
      })
      .catch(err => {
        return res.redirect(`/gallery/${id}/edit`)
      })
  })
  .delete(isAuthenticated, (req, res) => {
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
  .get(isAuthenticated, (req, res) => {
    return new Gallery({ id: req.params.id })
    .fetch({withRelated: [`user`]})
      .then(image => {
        let editImage = image.toJSON(); 
        res.render(`./edit`, editImage)
      })
  })

module.exports = router;