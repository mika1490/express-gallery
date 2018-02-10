const express = require(`express`);

const Gallery = require(`../db/models/Gallery`);

const router = express.Router();

router.route(`/`)
  .post((req, res) => {
 let {author, link, description} = req.body;

 return new Gallery({ author, link, description})
      .save()
      .then(image => {
        console.log('hi', image);
 res.json(image);
      })
      .catch(err => {
 return res.json({ message: err.message });
      });
  })
  .get((req, res) => {
 return Gallery
      .fetchAll()
      .then(image => {
 res.json(image);
      })
      .catch(err => {
 return res.json({ message: err.message });
      });
  })

//  router.route(`/:id`) 
//   .get((req, res) => {
//  return new Gallery()
//     .where({ id: req.params.id })
//     .fetch({ id: id})
//     .then(gallery => {
//  if(!gallery) {
//  throw new Error(`Gallery Not Found`);
//       }
//  return res.json(gallery);
//     })
//     .catch(err => {
//  return res.json({ message: err.message })
//     });
//   })

module.exports = router;