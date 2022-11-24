const db = require('../models')
const authConfig = require('../config/auth.config.js')
const sendEmail = require('./sendEmail.controller.js')
const crypto = require('crypto')
const allowedImageFormats = require('./imageSupport.js')
const User = db.users
const Image = db.images
const Token = db.tokens
const Restaurant = db.restaurants

exports.register = (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register a user'
  // #swagger.description = 'Handles creation of a new user, must specify if it is a user or an owner.'
  /* #swagger.parameters['user'] = {
          in: 'body',
          description: 'User information, must specify if it is a user or an owner. If it is an owner, it must specify the custom fields.
                        If it is a user, it must specify the google fields.',
          required: true,
          type: 'object',
          schema: { $ref: "#/definitions/createUser" }
  } */
  // #swagger.responses[200] = { description: 'Google account already existed, log in.' }
  // #swagger.responses[201] = { description: 'User successfully created' }
  // #swagger.responses[400] = { description: 'Error with given parameters.' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: 'Content cannot be empty!'
    })
  }

  if (req.body.role === 'owner') {
    console.log('Registering owner')

    // Create a Owner
    const owner = new User({
      role: req.body.role,
      custom: {
        email: req.body.custom.email,
        password: req.body.custom.password,
        name: req.body.custom.name
      },
      isLoggedIn: false,
      coordinates: {
        latitude: req.body.coordinates?.latitude || -34.603722,
        longitude: req.body.coordinates?.longitude || -58.381592
      }
    })

    // Save Owner in the database
    User.findOne({ 'custom.email': req.body.custom.email })
      .then(data => {
        if (data) {
          return res.status(400).send({
            message: 'Email already exists'
          })
        } else {
          owner
            .save()
            .then(data => {
              return res.status(201).send(data)
            })
            .catch(err => {
              return res.status(500).send({
                message:
              err.message || 'Some error occurred while creating the Owner.'
              })
            })
        }
      })
  }

  if (req.body.role === 'user') {
    console.log('Registering user')

    // Create a User
    const user = new User({
      role: req.body.role,
      google: {
        name: req.body.google.name,
        id: req.body.google.id,
        email: req.body.google.email,
        photoUrl: req.body.google.photoUrl
      },
      coordinates: {
        latitude: req.body.coordinates?.latitude || -34.603722,
        longitude: req.body.coordinates?.longitude || -58.381592
      }
    })

    // If the user already exists, don't create it again
    User.findOne({ 'google.email': req.body.google.email })
      .then(data => {
        if (data) {
          data.isLoggedIn = true
          data.save()
          return res.status(200).send(data)
        } else {
          // Save User in the database
          user.isLoggedIn = true
          user
            .save()
            .then(data => {
              return res.status(201).send(data)
            })
            .catch(err => {
              return res.status(500).send({
                message:
                err.message || 'Some error occurred while creating the User.'
              })
            })
        }
      })
      .catch(err => {
        return res.status(500).send({
          message:
          err.message || 'Some error occurred while looking for existing user.'
        })
      })
  }
}

exports.login = (req, res) => {
  // https://www.bezkoder.com/node-js-express-login-mongodb/#Controller_for_Registration_Login_Logout
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Login a user'
  // #swagger.description = 'Handles login of a user, must specify either credentials (custom login).'
  /* #swagger.parameters['credentials'] = {
          in: 'body',
          description: 'Credentials for custom login',
          required: false,
          type: 'object',
          schema: { $ref: "#/definitions/credentials" }
  }
  */
  /* #swagger.responses[200] = {
    description: 'Successfully logged in',
    schema: { $ref: "#/definitions/loginResponse" }
  }

  */
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: 'Content can not be empty!'
    })
  }

  // Find user by email
  User.findOne({ 'custom.email': req.body.email })
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'User not found'
        })
      } else {
        // Check if password is correct
        console.log('data is ' + data)
        const passwordIsValid = data.comparePassword(req.body.password)

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: 'Invalid Password!'
          })
        }

        // Update logged in status
        data.isLoggedIn = true
        data.save()

        return res.status(200).send({
          id: data._id,
          email: data.custom.email,
          name: data.custom.name,
          accessToken: 'this is a token'
        })
      }
    })
}

exports.logout = (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Logout a user'
  // #swagger.description = 'Handles logout of a user, must specify if it is a user or an owner to know strategy.'
  /* #swagger.parameters['userId'] = {
          in: 'body',
          description: 'Id of user',
          required: true,
          schema: { $ref: "#/definitions/logoutRequest" }
  }
  */
  // #swagger.responses[200] = { description: 'Successfully logged out' }
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const userId = req.body.userId

  if (!userId) {
    return res.status(400).send({
      message: 'Content can not be empty!'
    })
  }

  User.findById(userId)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'User not found'
        })
      } else {
        data.isLoggedIn = false
        data.save()
        return res.status(200).send({
          message: 'Successfully logged out'
        })
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: 'Error retrieving user with id ' + userId + ' ' + err
      })
    })
}

exports.sendRecoveryPassword = (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Recover password of a user'
  // #swagger.description = 'Handles password recovery of a user, can only be done for owner. Sends email to recover password'
  /* #swagger.parameters['email'] = {
          in: 'body',
          description: 'User email',
          required: true,
          schema: { $ref: "#/definitions/emailRequest" }
  }
  */
  // #swagger.responses[200] = { description: 'Email sent' }
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  // Sent email to recover password
  console.log(req.body)

  if (!req.body.email) {
    return res.status(400).send({
      message: 'Content can not be empty!'
    })
  }

  console.log('Sending email to recover password to ' + req.body.email)
  User.findOne({ 'custom.email': req.body.email })
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'User with given email does not exist'
        })
      } else {
        // Send email
        const token = new Token({
          userId: data._id,
          token: Math.floor(1000 + Math.random() * 9000)
        })
        token.save()
        const email = data.custom.email

        sendEmail(email, 'Password reset', token.token).then(
          () => {
            return res.status(200).send('Email sent to your email account')
          }
        )
          .catch(err => {
            return res.status(500).send({
              message:
            err.message || 'Some error occurred while sending email.'
            })
          })
      }
    })
}

exports.verifyRecoveryToken = (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Reset password of a user'
  // #swagger.description = 'Handles password reset of a user, can only be done for owner. Verifies token'
  /* #swagger.parameters['reset'] = {
          in: 'body',
          description: 'Body for password reset',
          required: false,
          type: 'object',
          schema: { $ref: "#/definitions/recoveryRequest" }
  }
  */

  // #swagger.responses[200] = { description: 'Password reset' }
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[404] = { description: 'Error finding token or password' }

  const token = req.body.token
  const userId = req.body.userId
  const password = req.body.password

  Token.findOne({ userId, token })
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'Invalid link or expired'
        })
      } else {
        User.findById(userId)
          .then(user => {
            user.custom.password = password
            user.save()
          })
      }
    })
}

// Retrieve a single user with id
exports.findOne = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Get a user with id'
  // #swagger.description = 'Gets a user via its id.'
  /* #swagger.responses[200] = {
    description: 'User retrieved successfully',
    schema: { $ref: "#/definitions/User" }
  }
  */
  // #swagger.responses[400] = { description: 'Needs to specify userId' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id

  if (!id) {
    return res.status(400).send({
      message: 'Needs to specify userId'
    })
  }

  User.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find user with id ${id}.`
        })
      } else {
        res.status(200).send(data)
      }
    })
}

// Update a user by the id in the request
// TODO: this method overwrites the entire subdocument, not just the fields that are being updated
exports.update = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Update a user with id'
  // #swagger.description = 'Updates a user via its id.'

  /* #swagger.parameters['user'] = {
          in: 'body',
          description: 'User information, must specify if it is a user or an owner. If it is an owner, it must specify the custom fields.
                        If it is a user, it must specify the google fields.',
          required: true,
          type: 'object',
          schema: { $ref: "#/definitions/User" }
  } */

  // #swagger.responses[200] = { description: 'User successfully updated' , schema: { $ref: "#/definitions/User" }}
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!'
    })
  }

  const name = req.body.name

  User.findById(id)
    .then(user => {
      if (!user) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        })
      } else {
        if (user.role === 'user') {
          user.google.name = name
        } else if (user.role === 'owner') {
          user.custom.name = name
        }

        user.save().then(newUser => {
          if (newUser) {
            res.status(200).send(newUser)
          } else {
            res.status(500).send({
              message: `Cannot update User with id=${id}. User Role undefined`
            })
          }
        }).catch(err => {
          res.status(500).send({
            message: 'Error updating User with id=' + id + ' with error: ' + err
          })
        })
      }
    })
}

// Delete a user with the specified id in the request
exports.delete = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Delete a user with id'
  // #swagger.description = 'Deletes a user via its id.'

  // #swagger.parameters['id'] = { description: 'User id', type: 'string' }

  // #swagger.responses[200] = { description: 'User successfully deleted' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const userId = req.params.id
  const password = req.body.password
  const email = req.body.email

  if (!password) {
    return res.status(400).send({
      message: 'Password can not be empty'
    })
  }

  if (!userId) {
    return res.status(400).send({
      message: 'User Id is required'
    })
  }

  if (!email) {
    return res.status(400).send({
      message: 'Email is required'
    })
  }

  try {
    let user = await User.findById(userId)
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Could not delete user with id=' + userId + ' with error: ' + error
    })
  }

  if (!user) {
    return res.status(404).send({
      message: `Cannot delete user with id=${userId}. Maybe the user was not found!`
    })
  }

  const samePasswords = user.comparePassword(password)

  if (!samePasswords) {
    return res.status(401).send({
      message: 'User password is incorrect'
    })
  }

  let userMail = ''

  if (user.role === 'user') {
    userMail = user.google.email
  } else if (user.role === 'owner') {
    userMail = user.custom.email
  }

  if (email !== userMail) {
    return res.status(401).send({
      message: 'User email is incorrect'
    })
  }

  User.findByIdAndRemove(userId, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete user with id=${userId}. Maybe the user was not found!`
        })
      } else {
        res.status(200).send({
          message: 'User was deleted successfully!'
        })
      }
    })
    .catch(err => {
      console.warn(err)
      res.status(500).send({
        message: 'Could not delete user with id=' + userId + ' with error: ' + err
      })
    })
}

// Upload a user image
exports.uploadUserImage = (req, res) => {
  // #swagger.auto = false
  // #swagger.tags = ['User']
  // #swagger.summary = 'Upload an user image'
  /* #swagger.description = `Endpoint to upload an user image.
                             Must be jpg, jpeg or png format.`
     #swagger.parameters['id'] = { description: 'Id for object to associate image to', required: 'true', type: 'string', in: 'path', name: 'id' }
     #swagger.parameters['image'] = { description: 'File: must be jpg, jpeg or png', required: 'true', name: 'file', type: 'file', in: 'formData' }
     #swagger.responses[200] = { description: 'Image uploaded successfully.' }
     #swagger.responses[400] = { description: 'Error with given parameters.' }
     #swagger.responses[404] = { description: 'Object the id belongs to not found.' }
     #swagger.responses[500] = { description: 'Error uploading image.' }
  */

  const id = req.params.id
  const reqImage = req.file

  if (!id) {
    return res.status(400).send({
      message: 'Id cannot be empty!'
    })
  }

  if (!reqImage) {
    return res.status(400).send({ message: 'Please upload an image!' })
  }

  const image = new Image({
    name: reqImage.originalname,
    type: reqImage.mimetype,
    data: new Buffer.from(reqImage.buffer, 'base64')
  })

  if (!allowedImageFormats.includes(image.type)) {
    return res.status(400).send({ message: `Please upload a valid image format: ${allowedImageFormats}` })
  }

  User.findById(id)
    .then(user => {
      image.save().then(savedImage => {
        user.profilePicture = savedImage.id
        console.log(savedImage)
        console.log(user)
        user.save().then(updatedUser => {
          res.status(200).send(updatedUser)
        }).catch(err => {
          res.status(500).send({
            message: `Error updating the user: ${err}`
          })
        })
      }).catch(err => {
        res.status(500).send({
          message: `Error uploading image: ${err}`
        })
      })
    }).catch(err => {
      res.status(500).send({
        message: `Cannot find user with id ${id}.`
      })
    })
}

// Find all favorite restaurants of a user
exports.findAllFavoriteRestaurants = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Get all favorite restaurants of a user'
  // #swagger.description = 'Gets all favorite restaurants of a user via its id.'

  // #swagger.parameters['id'] = { description: 'User id', type: 'string', in: 'path' }
  // #swagger.responses[200] = { description: 'Favorites successfully retrieved', schema: { $ref: "#/definitions/Restaurants" } }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id

  User.findById(id).populate('favoriteRestaurants')
    .then(async data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find user with id ${id}.`
        })
      } else {
        try {
          await Restaurant.populate(data.favoriteRestaurants, {
            path: 'pictures'
          })
        } catch (err) {
          res.status(500).send({
            message:
            err.message || 'Some error occurred while retrieving restaurants.'
          })
        }

        const restaurants = data.favoriteRestaurants.map(item => {
          const restInfo = {
            name: item.name,
            address: item.address.neighborhood + ' ' + item.address.streetNumber,
            score: Number(item.averageRating).toFixed(2),
            restaurantId: item._id,
            pictures: [], // TO DO : populate images
            isFavorite: true
          }

          return restInfo
        })

        res.status(200).send(restaurants)
      }
    })
}

// Add a restaurant to favorites
exports.changeRestaurantFavoriteStatus = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Change restaurant favorite status'
  // #swagger.description = 'Change the current favorite status of a restaurant for a user.'

  // #swagger.parameters['id'] = { description: 'User id', type: 'string' }
  /* #swagger.parameters['restaurantId'] = {
          in: 'body',
          description: 'Restaurant id to change favorite status for',
          required: true,
          type: 'string',
  } */

  // #swagger.responses[200] = { description: 'Restaurant successfully added to favorites' }
  // #swagger.responses[400] = { description: 'Restaurant id needs to be filled' }
  // #swagger.responses[404] = { description: 'Restaurant not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id
  const restaurantId = req.body.restaurantId

  if (!restaurantId) {
    return res.status(400).send({
      message: 'Restaurant id cannot be empty!'
    })
  }

  User.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find user with id ${id}.`
        })
      } else {
        if (data.favoriteRestaurants.includes(restaurantId)) {
          data.favoriteRestaurants.pull(restaurantId)
        } else {
          data.favoriteRestaurants.push(restaurantId)
        }
        data.save()
        res.status(200).send(data)
      }
    })
}

// Return all restaurants of an owner
exports.findAllRestaurants = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Get all restaurants of an owner'
  // #swagger.description = 'Gets all restaurants of an owner via its id.'

  // #swagger.parameters['id'] = { description: 'User id', type: 'string' }

  // #swagger.responses[200] = { description: 'Restaurants successfully retrieved', schema: { $ref: "#/definitions/Restaurants" } }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id

  User.findById(id).populate({
    path: 'ownedRestaurants',
    populate: {
      path: 'pictures',
      model: 'image'
    }
  }).then(data => {
    if (!data) {
      res.status(400).send({
        message: `User Id ${id} can not be found`
      })
    } else {
      const restaurants = data.ownedRestaurants.map(item => {
        const restInfo = {
          name: item.name,
          address: item.address.neighborhood + ' ' + item.address.streetNumber,
          score: Number(item.averageRating),
          restaurantId: item.id,
          pictures: item.pictures
        }

        const img64 = restInfo.pictures.map(element => {
          const str = element.data.toString('base64')
          return str
        })

        restInfo.pictures = img64

        return restInfo
      })

      res.status(200).send(restaurants)
    }
  })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving a user.'
      })
    })
}
