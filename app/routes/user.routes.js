module.exports = app => {
  const users = require('../controllers/user.controller.js')

  const router = require('express').Router()

  // Create a new user
  router.post('/owners/', users.create)

  // Retrieve all users
  router.get('/owners/', users.findAll)

  // Retrieve a single user with id
  router.get('/owners/:id', users.findOne)

  // Update an users with id
  router.put('/owners/:id', users.update)

  // Delete an user with id
  router.delete('/owners/:id', users.delete)

  // Retrieve all user favorite restaurants
  router.get('/owners/:id/favoriteRestaurants', users.findAllFavoriteRestaurants)

  // Add a favorite restaurant to the user
  router.post('/owners/:id/favoriteRestaurants/:restaurantId', users.addFavoriteRestaurant)

  app.use('/api/users', router)
}
