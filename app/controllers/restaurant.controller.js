const db = require('../models')
const Restaurant = db.restaurants
const Review = db.reviews
const Dish = db.dishes
const User = db.users

// Create and Save a new Restaurant
exports.create = (req, res) => {
  // #swagger.auto = false
  // #swagger.tags = ['Restaurant']
  // #swagger.summary = 'Create a restaurant.'
  /* #swagger.description = `Endpoint to create a restaurant.
                             Price range must be $, \$\$, $\$\$ or $\$\$\$ ($ is the cheapest, $\$\$\$ the most expensive).`
  */
  /* #swagger.parameters['Restaurants'] = {
    in: 'body',
    description: 'Restaurant object',
    required: true,
    type: 'object',
    schema: { $ref: "#/definitions/createRestaurant" }
  } */
  /* #swagger.responses[201] = {
    description: 'Restaurant created successfully',
    schema: { $ref: "#/definitions/Restaurant" }
  }
  #swagger.responses[400] = {
    description: 'Error with given parameters.'
  }
  #swagger.responses[500] = {
    description: 'Error creating restaurant',
  } */

  // Validate request
  const userId = req.params.userId;

  if (!req.body.name) {
    res.status(400).send({ message: 'Content cannot be empty!' })
    return
  }

  // Create a Restaurant
  const restaurant = new Restaurant({
    name : req.body.name,
    hours : req.body.hours,
    priceRange : req.body.priceRange,
    address: req.body.address || {},
    restaurantTypes : req.body.restaurantTypes,
    coordinates: req.body.coordinates || {}
  });

  // Save Restaurant in the database
  restaurant
    .save()
    .then(restaurant => {
      User.findByIdAndUpdate(
        { _id: userId },
        { $push: { ownedRestaurants: restaurant._id } },
        { useFindAndModify: false, returnDocument: 'after' }
      ).then(user => {
        res.status(201).send(restaurant);
      }).catch(err => {
        console.error(err);
        res.status(500).send({
          message: 'Error updating User with id=' + userId + ' with error: ' + err
        })
      })
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message:
      err.message || 'Some error occurred while creating the Restaurant.'
      })
    })
}

// Retrieve all Restaurants from the database.
// Can be filtered and sorted.
exports.findAll = (req, res) => {
  /* #swagger.tags = ['Restaurant']
     #swagger.summary = 'Retrieve all restaurants, can be filtered.'
     #swagger.description = `Retrieve all restaurants from the database,
                             can be filtered by name, price range, restaurant type, minRating and maxDistance.`

    #swagger.parameters['userId'] = {
      in: 'query',
      description: 'User id, it\'s used to determine location and relevance according to the user',
      required: true,
    }

    #swagger.parameters['name'] = {
      in: 'query',
      description: 'Filter by name',
      required: false,
    }

    #swagger.parameters['priceRange'] = {
      in: 'query',
      description: 'Filter by price range, can be $, \$\$, $\$\$ or $\$\$\$ ($ is the cheapest, $\$\$\$ the most expensive). Can be comma separated for multiples.',
      required: false,
    }

    #swagger.parameters['restaurantTypes'] = {
      in: 'query',
      description: 'Filter by restaurant type, can be one or more (needs to be comma separated)',
      required: false,
    }

    #swagger.parameters['minRating'] = {
      in: 'query',
      description: 'Filter by minimum rating, can be from 1 to 5',
      required: false,
    }

    #swagger.parameters['maxDistance'] = {
      in: 'query',
      description: 'Filter by maximum distance, can be from 0 to 100 km',
      required: false,
    }

     #swagger.responses[200] = {
     schema: { $ref: "#/definitions/Restaurants" }
    }
     #swagger.responses[500] = {
     description: 'Some error occurred while retrieving restaurants.',
    }
  */

  const name = req.query.name || ''
  console.log('name ' + name)
  const priceRange = req.query.priceRange ? req.query.priceRange.split(/[ ,]+/) : [new RegExp('.*')]
  console.log('priceRange: ' + priceRange)
  const restaurantTypes = req.query.restaurantTypes ? req.query.restaurantTypes.split(/[ ,]+/) : [new RegExp('.*')]
  console.log('restaurantTypes: ' + restaurantTypes)
  const minRating = req.query.minRating || 0
  console.log('minRating: ' + minRating)
  const maxDistance = req.query.maxDistance || 100000 // distance in km
  console.log('maxDistance: ' + maxDistance)

  User.findById(req.query.userId).then(
    user => {
      console.log('User at coordinates: ' + user.coordinates)

      Restaurant.aggregate(
        [
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [
                  user.coordinates.longitude, user.coordinates.latitude
                ]
              },
              distanceField: 'dist.calculated',
              maxDistance: maxDistance * 1000, // distance in meters
              key: 'coordinates',
              spherical: true
            }
          }, {
            $match: {
              name: {
                $regex: name,
                $options: 'i'
              },
              averageRating: {
                $gte: minRating
              },
              restaurantTypes: {
                $in: restaurantTypes
              },
              priceRange: {
                $in: priceRange
              }
            }
          }
        ]
      )
        .then(data => {
          const favoriteRestaurants = user.favoriteRestaurants

          data.forEach(restaurant => {
            restaurant.isFavorite = favoriteRestaurants.includes(restaurant._id)
          })

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
  ).catch(
    err => {
      res.status(500).send({
        message:
      err.message || 'User not send.'
      })
    }
  )
}

// Find a single Restaurant with an id
exports.findOne = (req, res) => {
  /*  #swagger.tags = ['Restaurant']
      #swagger.summary = 'Get a single restaurant by id.'
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
      #swagger.parameters['Restaurant'] = {
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
        description: 'Error with given body.',
      }
      #swagger.responses[404] = {
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

  Restaurant.findByIdAndUpdate(id, req.body, { useFindAndModify: false, returnDocument: 'after' })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else res.status(200).send(data)
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
      #swagger.parameters['userId'] = { description: 'user id', required: 'true', type: 'string' }
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['Review'] = {
        in: 'body',
        description: 'Review object',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/createReview" }
      }
      #swagger.responses[200] = {
        description: 'Review posted successfully',
      }
      #swagger.responses[400] = {
        description: 'Body cannot be empty',
      }
      #swagger.responses[404] = {
        description: 'User or restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Some error ocurred when creating the review',
      }
  */
  const restaurantId = req.params.restaurantId
  const userId = req.params.userId

  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!'
    })
  }

  console.log('Review body: ' + req.body)

  User.findById(userId).then(
    user => {
      if (!user) {
        return res.status(404).send({
          message: `Cannot find user with id=${userId}. Maybe user was not found!`
        })
      } else {
        const review = new Review({
          name: user.google.name,
          rating: req.body.rating,
          comment: req.body.comment
        })

        console.log(review)

        review
          .save(review)
          .then(newReview => {
            // Add review to array
            Restaurant.findOneAndUpdate(
              { _id: restaurantId },
              { $push: { reviews: newReview } },
              { upsert: false, new: true }).populate('reviews')
              .then(restaurant => {
                // After the review is added compute the new average rating
                const reviews = restaurant.reviews
                console.log("reviews: " + reviews)
                let sum = 0
                reviews.forEach(review => {
                  sum += review.rating
                })
                const averageRating = sum / reviews.length
                Restaurant.findOneAndUpdate(
                  { _id: restaurantId },
                  { $set: { averageRating: averageRating } },
                  { upsert: false, new: true })
                  .then(
                    data => {
                      console.log(data)
                      console.log('Average rating updated to ' + averageRating)
                    }
                  )
                  .catch(err => {
                    console.error('Error creating the average rating: ', err)
                  })
                return res.status(200).send({ message: 'Review posted successfully.' })
              })
              .catch(err => {
                return res.status(500).send({
                  message: 'Error updating Restaurant with id=' + restaurantId + ' with error: ' + err
                })
              })
          })
          .catch(err => {
            return res.status(500).send({
              message:
            err.message || 'Some error occurred while creating the review.'
            })
          })
      }
    }
  ).catch(err => {
    return res.status(500).send({
      message: 'Error retrieving user with id=' + userId + ' with error: ' + err
    })
  })
}

// Get all reviews from a restaurant
exports.findAllReviews = (req, res) => {
  /*  #swagger.tags = ['Review']
      #swagger.summary = 'Get all reviews from a restaurant.'
      #swagger.description = 'Endpoint to get all reviews from a restaurant.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.responses[200] = {
        description: 'Reviews retrieved successfully',
        schema: { $ref: '#/definitions/Reviews' }
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error retrieving reviews',
      }
  */

  const id = req.params.restaurantId

  Restaurant.findById(id).populate('reviews')
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

// Upload a restaurant image
exports.uploadRestaurantImage = (req, res) => {
  /*  #swagger.tags = ['Restaurant']
      #swagger.summary = 'Upload a restaurant image.'
      #swagger.description = 'Endpoint to upload a restaurant image.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['image'] = { description: 'Restaurant image', required: 'true', type: 'file', format: 'binary', in: 'formData' }
      #swagger.responses[200] = { description: 'Restaurant image uploaded successfully.' }
      #swagger.responses[400] = { description: 'Error with given parameters.' }
      #swagger.responses[404] = { description: 'Restaurant not found.' }
      #swagger.responses[500] = { description: 'Error uploading restaurant image.' }
  */
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

// Set restaurant status to boolean by force
exports.close = (req, res) => {
  /*  #swagger.tags = ['Restaurant']
      #swagger.summary = 'Set restaurant closed overwrite.'
      #swagger.description = `Endpoint to set restaurant closed overwrite,
                              if set to true restaurant will close regardless of time,
                              if set to false restaurant will open/close taking into account normal opening hours.`
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['status'] = { description: 'true/false closed overwrite', required: 'true', type: 'boolean' }
      #swagger.responses[200] = {
        description: 'Restaurant set to {status} successfully',
      }
      #swagger.responses[404] = {
        description: 'Restaurant not found',
      }
      #swagger.responses[500] = {
        description: 'Error {status} restaurant',
      }
  */
  const id = req.params.id
  const boolean = (req.params.status.toLowerCase() === 'true')

  Restaurant.findByIdAndUpdate(id, { isClosedOverwrite: boolean }, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
        })
      } else {
        const status = boolean ? 'closed' : 'opened'
        res.status(200).send({ message: 'Restaurant was set to ' + status + '.' })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
      })
    })
}

// Post a dish to a restaurant
exports.createDish = (req, res) => {
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Create a dish.'
      #swagger.description = 'Endpoint to create a dish.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['dish'] = {
        in: 'body',
        description: 'Dish object',
        required: 'true',
        type: 'object',
        schema: { $ref: '#/definitions/Dish' }
      }
      #swagger.responses[201] = {
        description: 'Dish created successfully',
      }
      #swagger.responses[400] = {
        description: 'Error with given parameters',
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

  console.log(req.body.ingredients)

  const dish = new Dish({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    picture: req.body.picture,
    ingredients: req.body.ingredients.toString(),
    isVegan: req.body.isVegan,
    isGlutenFree: req.body.isGlutenFree,
    discounts: req.body.discounts || 0
  })

  console.log(dish)

  dish
    .save(dish)
    .then(dishData => {
      // Add dish to array
      Restaurant.findOneAndUpdate(
        { _id: id },
        { $push: { menu: dishData.id } },
        { upsert: false, new: true })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`
            })
          } else res.status(201).send({ message: 'Restaurant was updated successfully.' })
        })
        .catch(err => {
          res.status(500).send({
            message: 'Error updating Restaurant with id=' + id + ' with error: ' + err
          })
        })
    })
    .catch(err => {
      res.status(500).send({
        message:
      err.message || 'Some error occurred while creating dish: ' + dish
      })
    })
}

// Get all dishes from a restaurant
// Reference: https://www.bezkoder.com/mongoose-one-to-many-relationship/
exports.findAllDishes = (req, res) => {
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Get all dishes from a restaurant.'
      #swagger.description = 'Endpoint to get all dishes from a restaurant.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
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

  const restaurantId = req.params.restaurantId

  Restaurant.findById(restaurantId).populate('menu')
    .then(data => {
      res.status(200).send(data.menu)
    })
    .catch(err => {
      res.status(500).send({
        message:
      err.message || 'Some error occurred while retrieving the menu for restaurant' + restaurantId
      })
    })
}

// Get a dish from a restaurant
exports.findOneDish = (req, res) => {
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Get a dish from a restaurant.'
      #swagger.description = 'Endpoint to get a dish from a restaurant.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
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

  const dishId = req.params.dishId

  Dish.findById(dishId)
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
      err.message || 'Some error occurred while retrieving the dish ' + dishId
      })
    })
}

// Update a dish from a restaurant
exports.updateDish = (req, res) => {
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Update a dish from a restaurant.'
      #swagger.description = 'Endpoint to update a dish from a restaurant.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
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

  Dish.findOneAndUpdate({ _id: dishId },
    { $set: req.body },
    { upsert: true, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Dish with restaurant=${id} and dish=${dishId}. Maybe Restaurant was not found!`
        })
      } else {
        data.save()
        res.status(200).send(data)
      }
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
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
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

  // TODO: add a pre remove hook to delete the file from the orphaned menu
  // https://stackoverflow.com/questions/51767118/delete-document-and-all-references-in-another-schema-mongodb

  const restaurantId = req.params.restaurantId
  const dishId = req.params.dishId

  Dish.findByIdAndDelete(dishId)
    .then(data => {
      if (data) {
        Restaurant.findOneAndUpdate(
          { _id: restaurantId },
          { $pull: { menu: dishId } },
          { upsert: false, new: true })
          .then(data => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update Dish with id=${dishId}. Maybe Dish was not found!`
              })
            } else res.status(200).send({ message: 'Dish deleted' })
          })
          .catch(err => {
            res.status(500).send({
              message: 'Error updating Restaurant with id=' + dishId + ' with error: ' + err
            })
          })
      } else {
        res.status(404).send({
          message: `Cannot delete dish with id=${dishId}. Maybe the dish was not found!`
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message: 'Could not delete Dish with id=' + dishId + ' with error: ' + err
      })
    })

  // Restaurant.findByIdAndRemove(dishId, { useFindAndModify: false })
  //   .then(data => {
  //     if (!data) {
  //       res.status(404).send({
  //         message: `Cannot delete dish with id=${dishId}. Maybe the dish was not found!`
  //       })
  //     } else {
  //       res.status(200).send({
  //         message: 'Dish was deleted successfully!'
  //       })
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: 'Could not delete Dish with id=' + dishId + ' with error: ' + err
  //     })
  //   })
}

// Upload a dish image
exports.uploadDishImage = (req, res) => {
  /*  #swagger.tags = ['Dish']
      #swagger.summary = 'Upload a dish image.'
      #swagger.description = 'Endpoint to upload a dish image.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['dishId'] = { description: 'Dish id', required: 'true', type: 'string' }
      #swagger.parameters['image'] = { description: 'Dish image', required: 'true', type: 'file', format: 'binary', in: 'formData' }
      #swagger.responses[200] = { description: 'Dish image uploaded successfully' }
      #swagger.responses[400] = { description: 'Error with given parameters' }
      #swagger.responses[404] = { description: 'Restaurant or dish not found' }
      #swagger.responses[500] = { description: 'Error uploading dish image' }
  */
}

// Create a category for a restaurant
exports.createCategory = (req, res) => {
  /*  #swagger.tags = ['Menu categories']
      #swagger.summary = 'Create a category for a restaurant.'
      #swagger.description = 'Endpoint to create a category for a restaurant.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['category'] = {
        in: 'body',
        required: 'true',
        type: 'object',
        schema: { $ref: '#/definitions/createMenuCategory' }
      }
      #swagger.responses[201] = {
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
  const restaurantId = req.params.restaurantId
  const category = req.body.name

  if (!category) {
    return res.status(400).send({
      message: 'Body for category cannot be empty!'
    })
  }

  console.log('New category is: ' + category)

  // Add category to array
  Restaurant.findOneAndUpdate(
    { _id: restaurantId },
    { $push: { menuCategories: category } },
    { upsert: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${restaurantId}. Maybe Restaurant was not found!`
        })
      } else res.status(201).send({ message: 'Restaurant was updated successfully.' })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Restaurant with id=' + restaurantId + ' with error: ' + err
      })
    })
}

// Get all categories from a restaurant
exports.findAllCategories = (req, res) => {
  /*  #swagger.tags = ['Menu categories']
      #swagger.summary = 'Get all categories from a restaurant.'
      #swagger.description = 'Endpoint to get all categories from a restaurant.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
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

  Restaurant.findById(id).populate('menuCategories')
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
  /*  #swagger.tags = ['Menu categories']
      #swagger.summary = 'Delete a category from a restaurant.'
      #swagger.description = 'Endpoint to delete a category from a restaurant.'
      #swagger.parameters['restaurantId'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['category'] = {
        in: 'body',
        required: 'true',
        type: 'object',
        schema: { $ref: '#/definitions/createMenuCategory' }
      }
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
  const category = req.body.category

  Restaurant.findOneAndUpdate(
    { _id: id },
    { $pull: { menuCategories: category } },
    { upsert: false, new: true })
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
  /*  #swagger.tags = ['Menu categories']
      #swagger.summary = 'Update a category from a restaurant.'
      #swagger.description = 'Endpoint to update a category from a restaurant.'
      #swagger.parameters['id'] = { description: 'Restaurant id', required: 'true', type: 'string' }
      #swagger.parameters['category'] = {
        in: 'body',
        required: 'true',
        type: 'object',
        schema: { $ref: '#/definitions/createMenuCategory' }
      }
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
    { upsert: false, new: true })
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
