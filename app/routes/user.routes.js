module.exports = app => {
  const users = require('../controllers/user.controller.js')
  const multerUploader = require('../middleware/multerUploader')
  const router = require('express').Router()
  const auth = require('../middleware/auth')

  // Auth routes
  // Handles creation of a new user
  router.post('/users/register', users.register)
  // Authenticate a user
  router.post('/users/login', users.login)
  // Logout a user
  router.post('/users/logout', auth, users.logout)
  // Recover password, currently only for the owner role
  router.post('/users/recoverPassword', users.sendRecoveryPassword)
  // Verify the token sent to the user's email
  router.post('/users/recoveryToken', users.verifyRecoveryToken)

  // Retrieve a single user with id
  router.get('/users/:id', auth, users.findOne)

  // Update a user with id
  router.patch('/users/:id', auth, users.update)

  // Delete a user with id
  router.delete('/users/:id', auth, users.delete)

  // Upload a user image
  router.post('/users/:id/image', auth, multerUploader.single('file'), users.uploadUserImage)

  // Normal user specific routes
  router.get('/users/:id/favorites', auth, users.findAllFavoriteRestaurants)
  router.patch('/users/:id/favorites', auth, users.changeRestaurantFavoriteStatus)

  // Owner specific routes
  // Retrieve all owner restaurants
  router.get('/users/:id/restaurants', auth, users.findAllRestaurants)

  app.use('/api/v1', router)
}
