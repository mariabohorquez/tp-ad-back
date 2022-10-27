const db = require('../models')
const authConfig = require('../config/auth.config.js')
const sendEmail = require('./sendEmail.controller.js')
const User = db.users
const Token = db.tokens

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
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
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
      location: {
        latitude: (req.body.location && req.body.location.latitude) || -34.603722,
        longitude: (req.body.location && req.body.location.longitude) || -58.381592
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
            .save(owner)
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
      location: {
        latitude: req.body.location?.latitude || -34.603722,
        longitude: req.body.location?.longitude || -58.381592
      }
    })

    // If the user already exists, don't create it again
    User.findOne({ 'google.email': req.body.google.email })
      .then(data => {
        if (data) {
          return res.status(200).send('User already exists')
        } else {
          // Save User in the database
          user
            .save(user)
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
  // #swagger.responses[200] = { description: 'Successfully logged in', schema: { $ref: "#/definitions/loginResponse" } }
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
        const passwordIsValid = data.comparePassword(req.body.password)

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: 'Invalid Password!'
          })
        }

        // TODO: Return refresh token
        // // Generate token
        // const token = jwt.sign({ id: data.id }, authConfig.secret, {
        //   expiresIn: 86400 // 24 hours
        // })

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
          in: 'header',
          description: 'Id of user',
          required: false,
          type: 'string',
  }
  */
  // #swagger.responses[200] = { description: 'Successfully logged out' }
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  // TODO: Needs to remove session from mongodb and stuff.
}

exports.sendRecoverPassword = (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Recover password of a user'
  // #swagger.description = 'Handles password recovery of a user, can only be done for owner. Sends email to recover password'
  /* #swagger.parameters['email'] = {
          in: 'header',
          description: 'User email',
          required: true,
          type: 'string',
  }
  */
  // #swagger.responses[200] = { description: 'Email sent' }
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: 'Content can not be empty!'
    })
  }

  // Sent email to recover password
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
          token: crypto.randomBytes(16).toString('hex')
        })
        Token.save(token)
        const email = data.custom.email

        const link = `${process.env.BASE_URL}/password-reset/${data._id}/${token.token}`
        sendEmail(email, 'Password reset', link).then(
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

exports.verifyRecoverToken = (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Reset password of a user'
  // #swagger.description = 'Handles password reset of a user, can only be done for owner. Verifies token
  // #swagger.parameters['userId'] = { description: 'User id', required: true, type: 'string' }
  // #swagger.parameters['token'] = { description: 'Token', required: true, type: 'string' }
  // #swagger.parameters['password'] = { description: 'New password', in: 'body', required: true, type: 'string' }

  // #swagger.responses[200] = { description: 'Password reset' }
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[404] = { description: 'Error finding token or password' }

  const token = req.params.token
  const userId = req.params.userId

  Token.findOne({ userId, token })
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'Invalid link or expired'
        })
      } else {
        User.findOne({ _id: userId })
          .then(user => {
            if (!user) {
              return res.status(404).send({
                message: 'User not found'
              })
            } else {
              // Update password
              console.log('Updating password')
              user.password = req.body.password
              user.save()
              return res.status(200).send({
                message: 'Password updated'
              })
            }
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

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false, returnDocument: 'after' })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        })
      } else res.status(200).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating User with id=' + id + ' with error: ' + err
      })
    })
}

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Delete a user with id'
  // #swagger.description = 'Deletes a user via its id.'

  // #swagger.parameters['id'] = { description: 'User id', type: 'string' }

  // #swagger.responses[200] = { description: 'User successfully deleted' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete user with id=${id}. Maybe the user was not found!`
        })
      } else {
        res.status(200).send({
          message: 'User was deleted successfully!'
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete user with id=' + id + ' with error: ' + err
      })
    })
}

// Upload a user image
exports.uploadUserImage = (req, res) => {
  /*  #swagger.tags = ['User']
      #swagger.summary = 'Upload a user image.'
      #swagger.description = 'Endpoint to upload a user image.'
      #swagger.parameters['id'] = { description: 'user id', required: 'true', type: 'string' }
      #swagger.parameters['image'] = { description: 'user image', required: 'true', type: 'file', format: 'binary', in: 'formData' }
      #swagger.responses[200] = { description: 'User image uploaded successfully.' }
      #swagger.responses[400] = { description: 'Error with given parameters.' }
      #swagger.responses[404] = { description: 'User not found.' }
      #swagger.responses[500] = { description: 'Error uploading user image.' }
  */
}

// Find all favorite restaurants of a user
exports.findAllFavoriteRestaurants = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Get all favorite restaurants of a user'
  // #swagger.description = 'Gets all favorite restaurants of a user via its id.'

  // #swagger.responses[200] = { description: 'Favorites successfully retrieved', schema: { $ref: "#/definitions/Restaurants" } }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id

  User.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find user with id ${id}.`
        })
      } else {
        res.status(200).send(data.favoriteRestaurants)
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
          in: 'query',
          description: 'Restaurant id to change favorite status for',
          required: true,
          type: 'string',
  } */

  // #swagger.responses[200] = { description: 'Restaurant successfully added to favorites' }
  // #swagger.responses[400] = { description: 'Restaurant id needs to be filled' }
  // #swagger.responses[404] = { description: 'Restaurant not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id
  const restaurantId = req.query.restaurantId

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

// Add a restaurant to owner's restaurants
exports.addRestaurant = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Add a restaurant to owner'
  // #swagger.description = 'Adds a restaurant to owner via its id.'

  // #swagger.parameters['id'] = { description: 'User id', type: 'string' }
  // #swagger.parameters['restaurantId'] = { description: 'Restaurant id to add to owner', type: 'string' }

  // #swagger.responses[200] = { description: 'Restaurant successfully added to owner' }
  // #swagger.responses[400] = { description: 'RestaurantId cannot be empty' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id
  const restaurantId = req.params.restaurantId

  if (!restaurantId) {
    return res.status(400).send({
      message: 'RestaurantId cannot be empty!'
    })
  }

  User.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find user with id ${id}.`
        })
      } else {
        data.ownedRestaurants.push(restaurantId)
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

  User.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find user with id ${id}.`
        })
      } else {
        res.status(200).send(data.ownedRestaurants)
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving a user.'
      })
    })
}
