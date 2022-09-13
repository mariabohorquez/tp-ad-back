const db = require('../models')
const Restaurant = db.restaurants
const Review = db.reviews
const Dish = db.dishes

// Create and Save a new Restaurant
exports.create = (req, res) => {
  /* #swagger.tags = ['Restaurant']
     #swagger.summary = 'Create a restaurant.'
     #swagger.description = `Endpoint to create a restaurant.
                             Prices must be either $, $$, $$$ or $$$$.
                             The menu will be empty at creation time.`
                             `
     #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Restaurant object',
      required: true,
      type: 'object',
      schema: { $ref: "#/definitions/Restaurant" }
   }
    #swagger.responses[200] = {
    description: 'Restaurant created successfully',
    schema: { $ref: "#/definitions/Restaurant" }
  }
    #swagger.responses[400] = {
    description: 'Body cannot be empty.',
  }
   #swagger.responses[500] = {
    description: 'Error creating restaurant',
  } */

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

exports.findAll = (req, res) => {
  /* #swagger.tags = ['Restaurant']
     #swagger.summary = 'Get all restaurants.'
     #swagger.description = 'Endpoint to get all restaurants.'
     #swagger.responses[200] = {
      description: 'Restaurants retrieved successfully',
      schema: { $ref: "#/definitions/Restaurant" }
     }
     #swagger.responses[500] = {
      description: 'Error retrieving restaurants',
     }
  */
  this.findAllWithFilter(req, res)
}

// Retrieve all Restaurants from the database.
// Can be filtered by name.
exports.findAllWithFilter = (req, res) => {
  /* #swagger.tags = ['Restaurant']
     #swagger.summary = 'Retrieve all restaurants with regex.'
     #swagger.description = `Retrieve all restaurants from the database.
                             If a name is provided, it will be used to filter the results.`
     #swagger.parameters['name'] =
      { description: 'Text to filter by',
      required: 'false',
      type: 'string' }

     #swagger.responses[200] = {
     schema: { $ref: "#/definitions/Restaurants" }
  }
     #swagger.responses[500] = {
     description: 'Error retrieving restaurants',
  } */

  const name = req.params.name === 'undefined' ? '' : req.params.name
  const condition = name ? { name: { $regex: new RegExp(name), $options: 'i' } } : {}
  console.log(condition)

  Restaurant.find(condition)
    .then(data => {
      console.log(data)
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
  /*  #swagger.tags = ['Restaurant']
      #swagger.summary = 'Get a restaurant by id.'
      #swagger.description = 'Endpoint to get a restaurant by id.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Restaurant retrieved successfully',
        schema: { $ref: "#/definitions/Restaurant" }
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error retrieving restaurant',
      }
  */

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
  /* #swagger.tags = ['Restaurant']
      #swagger.summary = 'Update a restaurant.'
      #swagger.description = 'Endpoint to update a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Restaurant object',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/Restaurant" }
      }
      #swagger.responses[200] = {
        description: 'Restaurant updated successfully',
        schema: { $ref: "#/definitions/Restaurant" }
      }
      #swagger.responses[400] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error updating restaurant',
      }
  */

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
      } else res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Post a review to a restaurant
exports.createReview = (req, res) => {
  /*  #swagger.tags = ['Review']
      #swagger.summary = 'Post a review to a restaurant.'
      #swagger.description = 'Endpoint to post a review to a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Review object',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/Review" }
      }
      #swagger.responses[200] = {
        description: 'Review posted successfully',
      }
      #swagger.responses[400] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error posting review',
      }
  */
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
      } else res.status(200).send({ message: 'Review posted successfully.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Delete a Restaurant with the specified id in the request
exports.delete = (req, res) => {
  /*  #swagger.tags = ['Restaurant']
      #swagger.summary = 'Delete a restaurant.'
      #swagger.description = 'Endpoint to delete a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Restaurant deleted successfully',
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error deleting restaurant',
      }
  */
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
  /*  #swagger.tags = ['Restaurant']
      #swagger.summary = 'Force restaurant to close.'
      #swagger.description = 'Endpoint to close a restaurant by force.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Restaurant set to closed successfully',
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error deactivating restaurant',
      }
  */

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
  /*  #swagger.tags = ['Restaurant']
      #swagger.summary = 'Remove restaurant closed overwrite.'
      #swagger.description = `Endpoint to remove restaurant closed overwrite,
                              will set restaurant to open if it's open time.`
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Restaurant set to open successfully',
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error activating restaurant',
      }
  */
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
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Create a dish.'
      #swagger.description = 'Endpoint to create a dish.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['dish'] = {
        in: 'body',
        description: 'Dish object',
        required: 'true',
        type: 'object',
        schema: { $ref: '#/definitions/Dish' }
      }
      #swagger.responses[200] = {
        description: 'Dish created successfully',
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error creating dish',
      }
  */

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
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Get all dishes from a restaurant.'
      #swagger.description = 'Endpoint to get all dishes from a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Dishes retrieved successfully',
        schema: { $ref: '#/definitions/Menu' }
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error retrieving dishes',
      }
  */

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
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Get a dish from a restaurant.'
      #swagger.description = 'Endpoint to get a dish from a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['dishId'] = { description: 'Dish id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Dish retrieved successfully',
        schema: { $ref: '#/definitions/Dish' }
      }
      #swagger.responses[404] = {
        description: 'Restaurant or dish not found',
      }
      #swagger.responses[500] = {
        description: 'Error retrieving dish',
      }
  */

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
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Update a dish from a restaurant.'
      #swagger.description = 'Endpoint to update a dish from a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['dishId'] = { description: 'Dish id', required: 'true', type: 'string' }
      #swagger.parameters['dish'] = {
        in: 'body',
        description: 'Dish object',
        required: 'true',
        type: 'object',
        schema: { $ref: '#/definitions/Dish' }
      }
      #swagger.responses[200] = {
        description: 'Dish updated successfully',
      }
      #swagger.responses[404] = {
        description: 'Restaurant or dish not found',
      }
      #swagger.responses[500] = {
        description: 'Error updating dish',
      }
  */

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
// Comment: it should delete the file after the model is fetched again.
exports.deleteDish = (req, res) => {
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Delete a dish from a restaurant.'
      #swagger.description = 'Endpoint to delete a dish from a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['dishId'] = { description: 'Dish id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Dish deleted successfully',
      }
      #swagger.responses[404] = {
        description: 'Restaurant or dish not found',
      }
      #swagger.responses[500] = {
        description: 'Error deleting dish',
      }
  */

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
  /*  #swagger.tags = ['Review']
      #swagger.summary = 'Get all reviews from a restaurant.'
      #swagger.description = 'Endpoint to get all reviews from a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Reviews retrieved successfully',
        schema: { $ref: '#/definitions/Review' }
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error retrieving reviews',
      }
  */

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
  /*  #swagger.tags = ['Category']
      #swagger.summary = 'Create a category for a restaurant.'
      #swagger.description = 'Endpoint to create a category for a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['category'] = {
        in: 'body',
        description: 'Category String',
        required: 'true',
        type: 'string' }
      #swagger.responses[200] = {
        description: 'Category created successfully',
      }
      #swagger.responses[400] = {
        description: 'Body for category cannot be empty!',
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error updating restaurant with category',
      }
  */
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
  /*  #swagger.tags = ['Category']
      #swagger.summary = 'Get all categories from a restaurant.'
      #swagger.description = 'Endpoint to get all categories from a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Categories retrieved successfully',
        type: 'array',
      }
      #swagger.responses[200] = {
        description: 'Categories retrieved successfully',
        type: 'array',
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error retrieving categories',
      }
  */
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
  /*  #swagger.tags = ['Category']
      #swagger.summary = 'Delete a category from a restaurant.'
      #swagger.description = 'Endpoint to delete a category from a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['category'] = {
        in: 'body',
        description: 'Category String',
        required: 'true',
        type: 'string' }
      #swagger.responses[200] = {
        description: 'Category deleted successfully',
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error updating restaurant with category',
      }
  */
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
  /*  #swagger.tags = ['Category']
      #swagger.summary = 'Update a category from a restaurant.'
      #swagger.description = 'Endpoint to update a category from a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['category'] = {
        in: 'body',
        description: 'Category String',
        required: 'true',
        type: 'string' }
      #swagger.responses[200] = {
        description: 'Category updated successfully',
      }
      #swagger.responses[400] = {
        description: 'Body for category cannot be empty!',
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error updating restaurant with category',
      }
  */
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
