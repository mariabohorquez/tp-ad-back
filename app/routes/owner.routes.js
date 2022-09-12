module.exports = app => {
  const owners = require('../controllers/owner.controller.js')

  const router = require('express').Router()

  // Create a new Owner
  router.post('/owners', owners.create)

  // Retrieve all owners
  router.get('/owners', owners.findAll)

  // Retrieve a single owner with id
  router.get('/owners/:id', owners.findOne)

  // Update an owners with id
  router.put('/owners/:id', owners.update)

  // Associate a restaurant to an owner
  router.put('/owners/:id/restaurant/:restaurantId', owners.addRestaurant)

  // Recover owner password
  router.post('/owners/:id/recoverPassword', owners.recoverPassword)

  // Delete an owner with id
  router.delete('/owners/:id', owners.delete)

  // Retrieve all owner restaurants
  router.get('/owners/:id/restaurants', owners.findAllRestaurants)

  app.use('/api', router)
}
