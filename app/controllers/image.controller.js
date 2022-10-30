const db = require('../models')
const uploadFilesMiddleware = require('../middleware/upload.middleware.js')

// For debugging
const fs = require('fs')
const { parse, stringify } = require('flatted')
const formidable = require('formidable')
const { nextTick } = require('process')

// Models
const Image = db.images
const Restaurant = db.restaurants
const Dish = db.dishes
const User = db.users

// Create and save a new image
exports.upload = async (req, res) => {
  // #swagger.auto = false
  // #swagger.tags = ['Image']
  // #swagger.summary = 'Upload an image'
  /* #swagger.description = `Endpoint to upload an image.
                             Must be jpg, jpeg or png format.`
     #swagger.consumes = ['multipart/form-data']
     #swagger.parameters['id'] = { description: 'Id for object to associate image to', required: 'true', type: 'string', in: 'formData', name: 'id' }
     #swagger.parameters['type'] = { description: 'Collection it belongs to, must be either user, restaurant or dish', required: 'true', type: 'string', in: 'formData', name: 'type' }
     #swagger.parameters['file'] = { description: 'File: must be jpg, jpeg or png', required: 'true', name: 'file', type: 'file', in: 'formData' }

     #swagger.responses[200] = { description: 'Image uploaded successfully.' }
     #swagger.responses[400] = { description: 'Error with given parameters.' }
     #swagger.responses[404] = { description: 'Object the id belongs to not found.' }
     #swagger.responses[500] = { description: 'Error uploading image.' }
  */
  uploadFilesMiddleware(req, res).then(
    async (result) => {
      console.log('result: ', result)
      console.log('body ' + JSON.stringify(req.body))
      console.log('file ' + req.file)
      if (req.file == undefined) {
        return res.status(400).send({ message: 'Please upload a file!' })
      }

      // Check if id belongs to an object
      let object = null
      if (req.body.type == 'user') {
        object = await User.findOne({ _id: req.body.id })
      } else if (req.body.type == 'restaurant') {
        object = await Restaurant.findOne({ _id: req.body.id })
      } else if (req.body.type == 'dish') {
        object = await Dish.findOne({ _id: req.body.id })
      }

      if (!object) {
        return res.status(404).send({ message: 'Object not found.' })
      }

      // Create a image
      const image = new Image({
        name: req.file.originalname,
        type: req.file.mimetype,
        data: req.file.buffer,
        belongsTo: req.body.id,
        belongsToCollection: req.body.type
      })

      // Save image in the database
      image
        .save(image)
        .then(data => {
          res.status(200).send({ message: 'Image uploaded successfully.' })
        })
        .catch(err => {
          res.status(500).send({ message: 'Error uploading image.' })
        })
    }
  )
}

exports.getAll = (req, res) => {
}

exports.getOne = (req, res) => {
}

exports.delete = (req, res) => {
}
