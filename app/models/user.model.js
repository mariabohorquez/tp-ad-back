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
        type: String,
      },
      email: {
        type: String,
        required: true,
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
      unique: false
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
    location: {
      latitude: {
        type: Number,
        required: false,
        unique: false
      },
      longitude: {
        type: Number,
        required: false,
        unique: false
     },
    },
  }, {
    timestamp: true
  })

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const User = mongoose.model('user', schema)
  return User
}
