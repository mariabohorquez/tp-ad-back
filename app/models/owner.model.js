module.exports = mongoose => {
  const schema = mongoose.Schema({
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
      required: false,
      unique: false
    },
    profilePicture: {
      type: Buffer,
      required: false,
      unique: false
    },
    restaurants: [
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

  const Owner = mongoose.model('owner', schema)
  return Owner
}
