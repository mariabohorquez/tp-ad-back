module.exports = app => {
  const users = require('../controllers/user.controller.js')

  const router = require('express').Router()

  // Create a new user
  router.post('/users/', users.create)

  // Retrieve all users
  router.get('/users/', users.findAll)

  // Retrieve a single user with id
  router.get('/users/:id', users.findOne)

  // Update an users with id
  router.patch('/users/:id', users.update)

  // Delete an user with id
  router.delete('/users/:id', users.delete)

  // Retrieve all user favorite restaurants
  router.get('/users/:id/favoriteRestaurants', users.findAllFavoriteRestaurants)

  router.patch('/users/:id/favorite/:restaurantId', users.changeRestaurantFavoriteStatus)

  // Auth routes
  router.post('/users/login', users.login)
  router.post('/users/register', users.register)
  router.post('/users/logout', users.logout)

  app.use('/api/v1', router)
}
