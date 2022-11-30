const bcrypt = require('bcrypt')

module.exports = mongoose => {
  const ImageSchema = mongoose.Schema({
    fileName: String,
    type: String,
    uri: Buffer
  })

  const schema = mongoose.Schema({
    role: {
      type: String,
      enum: ['user', 'owner'],
      default: 'user'
    },
    google: {
      id: {
        type: String,
        unique: true
      },
      name: {
        type: String
      },
      email: {
        type: String,
        unique: true
      },
      photoUrl: {
        type: String,
        required: false
      }
    },
    custom: {
      email: {
        type: String,
        unique: true
      },
      password: {
        type: String,
        unique: false
      },
      name: {
        type: String,
        unique: false
      }
    },
    pictures: [ImageSchema],

    favoriteRestaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant'
      }
    ],
    ownedRestaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant'
      }
    ],
    coordinates: {
      latitude: {
        type: Number,
        required: false,
        unique: false
      },
      longitude: {
        type: Number,
        required: false,
        unique: false
      }
    },
    isLoggedIn: {
      type: Boolean
    },
    token: {
      type: String,
      createdAt: {
        type: Date,
        expires: 7200,
        default: Date.now
      }
    }
  }, {
    timestamp: true
  })

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  // hash the password before the user is saved
  schema.pre('save', function hashPassword (next) {
    // hash the password only if the password has been changed or user is new
    if (!this.isModified('custom.password')) {
      console.log('password not modified')
      next()
      return
    }

    // generate the hash
    bcrypt.hash(this.custom.password, 10, (err, hash) => {
      if (err) {
        next(err)
        return
      }

      // change the password to the hashed version
      this.custom.password = hash
      next()
    })
  })

  // method to compare a given password with the database hash
  schema.methods.comparePassword = function comparePassword (password) {
    const data = bcrypt.compareSync(password, this.custom.password)
    return data
  }

  schema.methods.toUserObject = function toUserObject () {
    const { __v, _id, ...object } = this.toObject()

    const user = {}
    const isUser = object.role === 'user'
    user.id = _id
    user.role = object.role
    user.name = isUser ? object.google.name : object.custom.name
    user.email = isUser ? object.google.email : object.custom.email
    user.coordinates = object.coordinates
    user.isLoggedIn = object.isLoggedIn
    user.favoriteRestaurants = object.favoriteRestaurants
    user.ownedRestaurants = object.ownedRestaurants
    user.token = object.token ? object.token : null

    user.pictures = object.pictures.map(item => {
      const newItem = {
        fileName: item.fileName,
        type: item.type,
        id: item._id,
        uri: item.uri.toString('base64')
      }
      return newItem
    })

    return user
  }

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()

    object.id = _id
    if (object.profilePicture?.data) { object.profilePicture = object.profilePicture.data.toString('base64') }

    return object
  })

  const User = mongoose.model('user', schema)
  return User
}
