module.exports = app => {
  const users = require('../controllers/user.controller.js')

  const router = require('express').Router()

  // Auth routes
  // Handles creation of a new user
  router.post('/users/register', users.register)
  // Authenticate a user
  router.post('/users/login', users.login)
  // Logout a user
  router.post('/users/logout', users.logout)
  // Recover password, currently only for the owner role
  router.post('/users/recoverPassword', users.recoverPassword)

  // Retrieve a single user with id
  router.get('/users/:id', users.findOne)

  // Update a user with id
  router.patch('/users/:id', users.update)

  // Delete a user with id
  router.delete('/users/:id', users.delete)

  // Upload a user image
  router.post('/users/:id/image', users.uploadUserImage)

  // Normal user specific routes
  router.get('/users/:id/favoriteRestaurants', users.findAllFavoriteRestaurants)
  router.patch('/users/:id/favorites', users.changeRestaurantFavoriteStatus)

  // Owner specific routes
  // Associate restaurant to owner
  router.patch('/users/:id/restaurant/:restaurantId', users.addRestaurant)
  // Retrieve all owner restaurants
  router.get('/users/:id/restaurants', users.findAllRestaurants)

  // Upload an image
  // router.get('/users/:id/restaurants', users.uploadImage)

  app.use('/api/v1', router)
}
