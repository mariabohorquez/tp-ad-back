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
  router.put('/users/:id', users.update)

  // Delete an user with id
  router.delete('/users/:id', users.delete)

  // Retrieve all user favorite restaurants
  router.get('/users/:id/favoriteRestaurants', users.findAllFavoriteRestaurants)

  // Add a favorite restaurant to the user
  router.post('/users/:id/favoriteRestaurants/:restaurantId', users.addFavoriteRestaurant)

  app.use('/api', router)
}
