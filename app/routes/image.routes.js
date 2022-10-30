module.exports = app => {
  const image = require('../controllers/image.controller.js')

  const router = require('express').Router()

  // Upload a new image
  router.post('/images', image.upload)

  // Get all images
  router.get('/images', image.getAll)

  // Get a single image with id
  router.get('/images/:id', image.getOne)

  // Delete an image with id
  router.delete('/images/:id', image.delete)

  app.use('/api/v1', router)
}
