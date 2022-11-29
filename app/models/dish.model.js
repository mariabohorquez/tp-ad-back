
module.exports = mongoose => {
  const ImageSchema = mongoose.Schema({
    fileName: String,
    type: String,
    uri: Buffer,
  })

  const schema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: false
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      unique: false
    },
    discounts: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      unique: false
    },
    ingredients: {
      type: String, // fresa, leche, azucar
      required: true,
      unique: false
    },
    isVegan: {
      type: Boolean,
      required: false,
      unique: false,
      default: false
    },
    isGlutenFree: {
      type: Boolean,
      required: false,
      unique: false,
      default: false
    },
    pictures : [ImageSchema],
  }, {
    timestamp: true
  })

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    object.price = Number(object.price)
    object.discounts = Number(object.discounts)

    object.pictures = object.pictures.map(item => {
      const newItem = {
        fileName : item.fileName,
        type : item.type,
        id : item._id,
        uri : item.uri.toString('base64')
      }
      return newItem;
    })

    return object
  })

  const Dish = mongoose.model('dish', schema)
  return Dish
}
