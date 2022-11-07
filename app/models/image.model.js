
module.exports = mongoose => {
  const schema = mongoose.Schema({
    data: Buffer,
    name: String,
    type: String
  })

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const Image = mongoose.model('image', schema)
  return Image
}
