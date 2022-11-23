module.exports = app => {
  const restaurants = require('../controllers/restaurant.controller.js')
  const multerUploader = require('./multerUploader')
  const router = require('express').Router()

  // Create a new restaurant
  router.post('/restaurants', restaurants.create)

  // Retrieve all restaurants
  router.get('/restaurants', restaurants.findAll)

  // Retrieve a single restaurant with id
  router.get('/restaurants/:id', restaurants.findOne)

  // Update a restaurant with id
  router.patch('/restaurants/:id', restaurants.update)

  // Delete a restaurant with id
  router.delete('/restaurants/:id', restaurants.delete)

  // Set restaurant status to boolean by force
  router.patch('/restaurants/:id/close/:status', restaurants.close)

  // Reviews
  router.post('/restaurants/:restaurantId/reviews/:userId', restaurants.createReview)
  router.get('/restaurants/:restaurantId/reviews', restaurants.findAllReviews)

  // Restaurant Image
  router.post('/restaurants/:restaurantId/image', multerUploader.single('file'), restaurants.uploadRestaurantImage)

  // Dishes CRUD
  router.post('/restaurants/:restaurantId/dishes', restaurants.createDish)
  router.get('/restaurants/:restaurantId/dishes', restaurants.findAllDishes)
  router.get('/restaurants/:restaurantId/dishes/:dishId', restaurants.findOneDish)
  router.patch('/restaurants/:restaurantId/dishes/:dishId', restaurants.updateDish)
  router.delete('/restaurants/:restaurantId/dishes/:dishId', restaurants.deleteDish)
  router.post('/restaurants/:restaurantId/dishes/:dishId', multerUploader.single('file'), restaurants.uploadDishImage)

  // Menu categories CRUD
  router.post('/restaurants/:restaurantId/categories', restaurants.createCategory)
  router.get('/restaurants/:restaurantId/categories', restaurants.findAllCategories)
  router.delete('/restaurants/:restaurantId/categories', restaurants.deleteCategory)

  app.use('/api/v1', router)
}
