const dbConfig = require('../config/db.config.js')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url
db.restaurants = require('./restaurant.model.js')(mongoose)
db.dishes = require('./dish.model.js')(mongoose)
db.reviews = require('./review.model.js')(mongoose)
db.users = require('./user.model.js')(mongoose)
db.tokens = require('./token.model.js')(mongoose)
db.images = require('./image.model.js')(mongoose)

module.exports = db
