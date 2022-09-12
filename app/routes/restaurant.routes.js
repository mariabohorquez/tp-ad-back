module.exports = app => {
  const restaurants = require('../controllers/restaurant.controller.js')

  const router = require('express').Router()

  // Create a new Restaurant
  router.post('/restaurant', restaurants.create)

  // Retrieve all restaurants
  router.get('/restaurant', restaurants.findAll)

  // Retrieve all restaurants matching a regex
  router.get('/restaurant/:name', restaurants.findAllWithFilter)

  // Retrieve a single Restaurants with id
  router.get('/restaurant/id/:id', restaurants.findOne)

  // Update a Restaurants with id
  router.put('/restaurant/:id', restaurants.update)

  // Post a review to a restaurant
  router.post('/restaurant/:id/review', restaurants.createReview)

  // Delete a Restaurants with id
  router.delete('/restaurant/:id', restaurants.delete)

  // Set restaurant status to closed by force
  router.put('/restaurant/:id/deactivate', restaurants.deactivate)

  // Remove closed by force flag
  router.put('/restaurant/:id/activate', restaurants.activate)

  // Dishes CRUD
  router.post('/restaurant/:restaurantId/dishes', restaurants.createDish)
  router.get('/restaurant/:restaurantId/dishes', restaurants.findAllDishes)
  router.get('/restaurant/:restaurantId/dishes/:dishId', restaurants.findOneDish)
  router.put('/restaurant/:restaurantId/dishes/:dishId', restaurants.updateDish)
  router.delete('/restaurant/:restaurantId/dishes/:dishId', restaurants.deleteDish)

  // Dishes categories
  router.post('/restaurant/:restaurantId/dishes/categories', restaurants.createCategory)
  router.get('/restaurant/:restaurantId/dishes/categories', restaurants.findAllCategories)
  router.delete('/restaurant/:restaurantId/dishes/categories/:categoryId', restaurants.deleteCategory)
  router.put('/restaurant/:restaurantId/dishes/categories/:categoryId', restaurants.updateCategory)

  // Helper routes
  router.get('/restaurant/:restaurantId/reviews', restaurants.findAllReviews)

  app.use('/api', router)
}
