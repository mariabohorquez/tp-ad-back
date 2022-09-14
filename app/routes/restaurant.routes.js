module.exports = app => {
  const restaurants = require('../controllers/restaurant.controller.js')

  const router = require('express').Router()

  // Create a new Restaurant
  router.post('/restaurants', restaurants.create)

  // Retrieve all restaurants
  router.get('/restaurants', restaurants.findAll)

  // Retrieve all restaurants matching a regex
  router.get('/restaurants/:name', restaurants.findAllWithFilter)

  // Retrieve a single Restaurants with id
  router.get('/restaurants/id/:id', restaurants.findOne)

  // Update a Restaurants with id
  router.patch('/restaurants/:id', restaurants.update)

  // Delete a Restaurants with id
  router.delete('/restaurants/:id', restaurants.delete)

  // Set restaurant status to closed by force
  router.patch('/restaurants/:id/deactivate', restaurants.deactivate)

  // Remove closed by force flag
  router.patch('/restaurants/:id/activate', restaurants.activate)

  // Reviews
  router.post('/restaurants/:restaurantId/review/:userId', restaurants.createReview)
  router.get('/restaurants/:restaurantId/reviews', restaurants.findAllReviews)

  // Dishes CRUD
  router.post('/restaurants/:restaurantId/dishes', restaurants.createDish)
  router.get('/restaurants/:restaurantId/dishes', restaurants.findAllDishes)
  router.get('/restaurants/:restaurantId/dishes/:dishId', restaurants.findOneDish)
  router.patch('/restaurants/:restaurantId/dishes/:dishId', restaurants.updateDish)
  router.delete('/restaurants/:restaurantId/dishes/:dishId', restaurants.deleteDish)

  // Dishes categories
  router.post('/restaurants/:restaurantId/categories', restaurants.createCategory)
  router.get('/restaurants/:restaurantId/categories', restaurants.findAllCategories)
  router.delete('/restaurants/:restaurantId/categories/:categoryId', restaurants.deleteCategory)
  router.patch('/restaurants/:restaurantId/categories/:categoryId', restaurants.updateCategory)

  app.use('/api/v1', router)
}
