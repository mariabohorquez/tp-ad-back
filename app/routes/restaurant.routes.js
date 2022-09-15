module.exports = app => {
  const restaurants = require('../controllers/restaurant.controller.js')

  const router = require('express').Router()

  // Create a new restaurant
  router.post('/restaurants', restaurants.create)

  // Retrieve all restaurants matching a regex
  router.get('/restaurants/:name', restaurants.findAllWithFilter)

  // Retrieve a single restaurant with id
  router.get('/restaurants/:id', restaurants.findOne)

  // Update a restaurant with id
  router.patch('/restaurants/:id', restaurants.update)

  // Delete a restaurant with id
  router.delete('/restaurants/:id', restaurants.delete)

  // Set restaurant status to boolean by force
  router.patch('/restaurants/:id/close/:status', restaurants.close)

  // Reviews
  router.post('/restaurants/:restaurantId/review/:userId', restaurants.createReview)
  router.get('/restaurants/:restaurantId/reviews', restaurants.findAllReviews)

  // Dishes CRUD
  router.post('/restaurants/:restaurantId/dishes', restaurants.createDish)
  router.get('/restaurants/:restaurantId/dishes', restaurants.findAllDishes)
  router.get('/restaurants/:restaurantId/dishes/:dishId', restaurants.findOneDish)
  router.patch('/restaurants/:restaurantId/dishes/:dishId', restaurants.updateDish)
  router.delete('/restaurants/:restaurantId/dishes/:dishId', restaurants.deleteDish)
  // router.post('/restaurants/:restaurantId/dishes/:dishId', restaurants.uploadImage)

  // Dishes categories
  router.post('/restaurants/:restaurantId/categories', restaurants.createCategory)
  router.get('/restaurants/:restaurantId/categories', restaurants.findAllCategories)
  router.delete('/restaurants/:restaurantId/categories/:categoryId', restaurants.deleteCategory)

  app.use('/api/v1', router)
}
