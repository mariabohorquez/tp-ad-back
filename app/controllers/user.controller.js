const db = require('../models')
const User = db.users

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
  // #swagger.description = 'Handles login of a user, must specify either accessToken (google) or credentials (custom login).'
  /* #swagger.parameters['accessToken'] = {
          in: 'header',
          description: 'Token from google or custom login',
          required: false,
          type: 'string',
  } */
  /* #swagger.parameters['credentials'] = {
          in: 'body',
          description: 'Credentials for custom login',
          required: false,
          type: 'object',
          schema: { $ref: "#/definitions/credentials" }
  }
  */
  // #swagger.responses[200] = { description: 'Successfully logged in' }
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: 'Content can not be empty!'
    })
  }

  // TODO: Handle callback with tokens and stuff
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

exports.recoverPassword = (req, res) => {
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

  // TODO: Sends email to recover password
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
}

// Add a restaurant to favorites
exports.changeRestaurantFavoriteStatus = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Change restaurant favorite status'
  // #swagger.description = 'Change the current favorite status of a restaurant for a user.'

  // #swagger.parameters['id'] = { description: 'User id', type: 'string' }
  /* #swagger.parameters['restaurantId'] = {
          in: 'header',
          description: 'Restaurant id to change favorite status for',
          required: true,
          type: 'string',
  } */

  // #swagger.responses[200] = { description: 'Restaurant successfully added to favorites' }
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[404] = { description: 'Restaurant not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id
}

// Add a restaurant to owner's restaurants
exports.addRestaurant = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Add a restaurant to owner'
  // #swagger.description = 'Adds a restaurant to owner via its id.'

  // #swagger.responses[200] = { description: 'Restaurant successfully added to owner' }
  // #swagger.responses[400] = { description: 'Content cannot be empty' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Internal server error, returns specific error message' }

  const id = req.params.id
  const restaurantId = req.params.restaurantId
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
}
