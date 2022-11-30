module.exports = app => {
  const restaurants = require('../controllers/restaurant.controller.js')
  const multerUploader = require('../middleware/multerUploader')
  const router = require('express').Router()
  const auth = require('../middleware/auth')

  // Create a new restaurant
  router.post('/restaurants', auth, restaurants.create)

  // Retrieve all restaurants
  router.get('/restaurants', auth, restaurants.findAll)

  // Retrieve a single restaurant with id
  router.get('/restaurants/:id', auth, restaurants.findOne)

  // Update a restaurant with id
  router.patch('/restaurants/:id', auth, restaurants.update)

  // Delete a restaurant with id
  router.delete('/restaurants/:id', auth, restaurants.delete)

  // Set restaurant status to boolean by force
  router.patch('/restaurants/:id/close/:status', auth, restaurants.close)

  // Reviews
  router.post('/restaurants/:restaurantId/reviews/:userId', auth, restaurants.createReview)
  router.get('/restaurants/:restaurantId/reviews', auth, restaurants.findAllReviews)

  // Restaurant Image
  router.post('/restaurants/:restaurantId/image', [auth, multerUploader.single('file')], restaurants.uploadRestaurantImage)

  // Dishes CRUD
  router.post('/restaurants/:restaurantId/dishes', auth, restaurants.createDish)
  router.get('/restaurants/:restaurantId/dishes', auth, restaurants.findAllDishes)
  router.get('/restaurants/:restaurantId/dishes/:dishId', auth, restaurants.findOneDish)
  router.patch('/restaurants/:restaurantId/dishes/:dishId', auth, restaurants.updateDish)
  router.delete('/restaurants/:restaurantId/dishes/:dishId', auth, restaurants.deleteDish)
  router.post('/restaurants/:restaurantId/dishes/:dishId', [auth, multerUploader.single('file')], restaurants.uploadDishImage)

  // Menu categories CRUD
  router.post('/restaurants/:restaurantId/categories', auth, restaurants.createCategory)
  router.get('/restaurants/:restaurantId/categories', auth, restaurants.findAllCategories)
  router.delete('/restaurants/:restaurantId/categories', auth, restaurants.deleteCategory)

  app.use('/api/v1', router)
}
