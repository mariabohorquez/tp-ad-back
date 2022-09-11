const db = require('../models')
const Restaurant = db.restaurants
const Review = db.reviews
const Dish = db.dishes

// Create and Save a new Restaurant
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: 'Content can not be empty!' })
    return
  }

  // Create a Restaurant
  const restaurant = new Restaurant({
    name: req.body.name,
    openingTime: req.body.openingTime,
    closingTime: req.body.closingTime,
    priceRange: req.body.priceRange,
    address: req.body.address || {},
    restaurantTypes: req.body.restaurantTypes,
    menuCategories: req.body.menuCategories || [],
    menu: req.body.menu || []
  })

  // Save Restaurant in the database
  restaurant
    .save(restaurant)
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
      err.message || 'Some error occurred while creating the Restaurant.'
      })
    })
}

// Retrieve all Restaurants from the database.
// Can be filtered by name.
exports.findAll = (req, res) => {
  const name = req.params.name
  const condition = name ? { name: { $regex: new RegExp(name), $options: 'i' } } : {}
  console.log(condition)

  Restaurant.find(condition)
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
      err.message || 'Some error occurred while retrieving restaurants.'
      })
    })
}

// Find a single Restaurant with an id
exports.findOne = (req, res) => {
  const id = req.params.id

  Restaurant.findById(id)
    .then(data => {
      if (!data) { res.status(404).send({ message: 'Not found Restaurant with id ' + id }) } else res.status(200).send(data)
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: 'Error retrieving Restaurant with id=' + id + ' with error: ' + err })
    })
}

// Update a Restaurant by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!'
    })
  }

  const id = req.params.id

  Restaurant.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else res.send({ message: 'Restaurant was updated successfully.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Post a review to a restaurant
exports.createReview = (req, res) => {
  const id = req.params.id

  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!'
    })
  }

  const review = new Review({
    name: req.body.name,
    rating: req.body.rating,
    comment: req.body.comment
  })

  console.log(review)

  review
    .save(review)
    .catch(err => {
      res.status(500).send({
        message:
      err.message || 'Some error occurred while creating the review.'
      })
    })

  // Add review to array
  Restaurant.findOneAndUpdate(
    { _id: id },
    { $push: { reviews: review } },
    { upsert: true, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else res.status(200).send({ message: 'Restaurant was updated successfully.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Delete a Restaurant with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id

  Restaurant.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else {
        res.status(200).send({
          message: 'Restaurant was deleted successfully!'
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Set restaurant to closed with overwrite
exports.deactivate = (req, res) => {
  const id = req.params.id

  Restaurant.findByIdAndUpdate(id, { isClosedOverwrite: true }, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else res.status(200).send({ message: 'Restaurant was set to closed.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Remove restaurant overwrite for restaurant closed
exports.activate = (req, res) => {
  const id = req.params.id

  Restaurant.findByIdAndUpdate(id, { isClosedOverwrite: false }, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else res.status(200).send({ message: 'Restaurant was set to closed.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Post a review to a restaurant
exports.createDish = (req, res) => {
  const id = req.params.restaurantId

  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!'
    })
  }

  const dish = new Dish({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    picture: req.body.picture,
    ingredients: req.body.ingredients,
    isVegan: req.body.isVegan,
    isGlutenFree: req.body.isGlutenFree
  })

  console.log(dish)

  dish
    .save(dish)
    .catch(err => {
      res.status(500).send({
        message:
      err.message || 'Some error occurred while creating dish: ' + dish
      })
    })

  // Add dish to array
  Restaurant.findOneAndUpdate(
    { _id: id },
    { $push: { menu: dish } },
    { upsert: true, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else res.status(200).send({ message: 'Restaurant was updated successfully.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Get all dishes from a restaurant
// Reference: https://www.bezkoder.com/mongoose-one-to-many-relationship/
exports.findAllDishes = (req, res) => {
  const id = req.params.restaurantId

  Restaurant.findById(id).populate('menu', '-_id -__v')
    .then(data => {
      res.status(200).send(data.menu)
    })
    .catch(err => {
      res.status(500).send({
        message:
      err.message || 'Some error occurred while retrieving the menu for restaurant' + id
      })
    })
}

// Get a dish from a restaurant
exports.findOneDish = (req, res) => {
  const id = req.params.restaurantId
  const dishId = req.params.dishId

  Restaurant.findById(id).populate('menu', '-_id -__v')
    .then(data => {
      res.status(200).send(data.menu.id(dishId))
    })
    .catch(err => {
      res.status(500).send({
        message:
      err.message || 'Some error occurred while retrieving the menu for restaurant' + id
      })
    })
}

// Update a dish from a restaurant
exports.updateDish = (req, res) => {
  const id = req.params.restaurantId
  const dishId = req.params.dishId

  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!'
    })
  }

  Restaurant.findOneAndUpdate(
    { _id: id, 'menu._id': dishId },
    { $set: { 'menu.$': req.body } },
    { upsert: true, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Dish with restaurant=${id} and dish=${dishId}. Maybe Restaurant was not found!`
        })
      } else res.status(200).send({ message: 'Restaurant was updated successfully.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating dish with id=' + id + ' and dish=' + dishId + ' with error: ' + err
      })
    })
}

// Delete a dish from a restaurant
// TODO: test that deleting a dish also deletes the dish from the menu array of the restaurant
exports.deleteDish = (req, res) => {
  const dishId = req.params.dishId

  Restaurant.findByIdAndRemove(dishId, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete dish with id=${dishId}. Maybe the dish was not found!`
        })
      } else {
        res.status(200).send({
          message: 'Dish was deleted successfully!'
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete Dish with id=' + dishId + ' with error: ' + err
      })
    })
}

// Get all reviews from a restaurant
exports.findAllReviews = (req, res) => {
  const id = req.params.restaurantId

  Restaurant.findById(id).populate('reviews', '-_id -__v')
    .then(data => {
      res.status(200).send(data.reviews)
    })
    .catch(err => {
      res.status(500).send({
        message:
      `${err.message} ocurred while retrieving the reviews for restaurant ` + id
      })
    })
}

// Create a category for a restaurant
exports.createCategory = (req, res) => {
  const id = req.params.restaurantId
  const category = req.body.category

  if (!category) {
    return res.status(400).send({
      message: 'Body for category cannot be empty!'
    })
  }

  console.log('New category is: ' + category)

  // Add category to array
  Restaurant.findOneAndUpdate(
    { _id: id },
    { $push: { menuCategories: category } },
    { upsert: true, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else res.status(200).send({ message: 'Restaurant was updated successfully.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Get all categories from a restaurant
exports.findAllCategories = (req, res) => {
  const id = req.params.restaurantId

  Restaurant.findById(id).populate('menuCategories', '-_id -__v')
    .then(data => {
      res.status(200).send(data.menuCategories)
    })
    .catch(err => {
      res.status(500).send({
        message:
      `${err.message} ocurred while retrieving the categories for restaurant ` + id
      })
    })
}

// Delete a category from a restaurant
exports.deleteCategory = (req, res) => {
  const id = req.params.restaurantId
  const category = req.params.category

  Restaurant.findOneAndUpdate(
    { _id: id },
    { $pull: { menuCategories: category } },
    { upsert: true, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else res.status(200).send({ message: 'Restaurant was updated successfully. Category deleted' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Update a category from a restaurant
exports.updateCategory = (req, res) => {
  const id = req.params.restaurantId
  const category = req.params.category
  const newCategory = req.body.category

  if (!newCategory) {
    return res.status(400).send({
      message: 'Body for category cannot be empty!'
    })
  }

  Restaurant.findOneAndUpdate(
    { _id: id, menuCategories: category },
    { $set: { 'menuCategories.$': newCategory } },
    { upsert: true, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else res.status(200).send({ message: 'Restaurant was updated successfully.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}
