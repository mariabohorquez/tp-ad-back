
module.exports = mongoose => {
  const schema = mongoose.Schema({
    path: {
      type: String,
      required: true,
      trim: true
    },
    originalname: {
      type: String,
      required: true
    }
  })

  const Image = mongoose.model('image', schema)
  return Image
}
