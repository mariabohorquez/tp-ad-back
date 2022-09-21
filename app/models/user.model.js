module.exports = mongoose => {
  const schema = mongoose.Schema({
    role: {
      type: String,
      enum : ['user','owner'],
      default: 'user'
    },
    google: {
      id: {
        type: String,
        required: true,
        unique: true
      },
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }
    },
    custom: {
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
        unique: false
      },
      name: {
        type: String,
        required: true,
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
    ]
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
