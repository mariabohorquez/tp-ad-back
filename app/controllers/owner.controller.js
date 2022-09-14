const db = require('../models')
const Owner = db.owner

// Create and Save a new Owner
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: 'Content can not be empty!' })
    return
  }

  // Create an Owner
  const owner = new Owner({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  })

  // Save Owner in the database
  owner
    .save(owner)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Owner.'
      })
    })
}

// Retrieve all Owners from the database.
exports.findAll = (req, res) => {
  // #swagger.tags = ['Owner']
  // #swagger.description = 'Retrieve all Owners from the database.'
  const name = req.query.name
  var condition = name ? { name: { $regex: new RegExp(name), $options: 'i' } } : {}

  Owner.find(condition)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving owners.'
      })
    })
}
