
module.exports = mongoose => {
  const schema = mongoose.Schema({
    data: Buffer,
    contentType: String
  })

  const Image = mongoose.model('image', schema)
  return Image
}
