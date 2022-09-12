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
