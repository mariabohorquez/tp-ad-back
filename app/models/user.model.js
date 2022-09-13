module.exports = mongoose => {
  const schema = mongoose.Schema({
    google: {
      id: {
        type: String,
      },
      name: {
        type: Stri0ng,
      },
      email: {
        type: String,
      },
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
