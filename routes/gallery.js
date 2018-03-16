
const express = require(`express`);

const Gallery = require(`../db/models/Gallery`);

const User = require(`../db/models/User`);

const handlebars = require(`express-handlebars`);

const router = express.Router();

const { isAuthenticated } = require(`./helper`);

router.get(`/new`, (req, res) => {
  let locals = {
    loggedInUser: req.user.username,
    editImage: true
  }
  return res.render(`./new`, locals);
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
      .fetchAll({ withRelated: [`user`] })
      .then(image => {
        let images = image.toJSON();
        if (!req.user) {
          let locals = {
            db: images,
          }
          return res.render(`./gallery`, locals)
        } else if (isAuthenticated) {
          let locals = {
            db: images,
            loggedInUser: req.user.username,
            editImage: true
          }
          return res.render(`./gallery`, locals)
        }
      })
      .catch(err => {
        return res.json({ message: err.message });
      })
  })

router.route(`/:id`)
  .get((req, res) => {
    let locals = {};
    return new Gallery()
      .where({ id: req.params.id })
      .fetch({ withRelated: [`user`] })
      .then(image => {
        if (!image) {
          return res.redirect(`/gallery`)
        } else {
          locals = {
            singleImage: image.toJSON(),
            editImage: true,
            loggedInUser: req.user.username
          }
        }
        return new Gallery()
          .where({ user_id: locals.singleImage.user_id })
          .fetchAll()
      })
      .then(userImages => {
        locals.images = userImages.toJSON();
        console.log('VVVVVVV', locals)
        return res.render(`./singleimage`, locals)
      })
      .catch(err => {
        return res.redirect(`/gallery`)
      })
  })
  .put(isAuthenticated, (req, res) => {
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
      .fetch({ withRelated: [`user`] })
      .then(image => {
        if (image.toJSON().user_id === req.user.id) {
          let editImage = image.toJSON();
          return res.render(`./edit`, editImage)
        } else {
          return res.redirect('/gallery')
        }
      })
  })

module.exports = router;