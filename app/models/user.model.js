const bcrypt = require('bcrypt')

module.exports = mongoose => {
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
    profilePicture: {
      type: Buffer,
      required: false,
      unique: false,
      default : [],
    },
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
      next()
      return
    }

    // generate the hash
    console.log('hashing password: ' + this.custom.password)
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
    console.log('password ' + password)
    console.log('this.password ' + this.custom.password)
    const data = bcrypt.compareSync(password, this.custom.password)
    return data
  }

  const User = mongoose.model('user', schema)
  return User
}
