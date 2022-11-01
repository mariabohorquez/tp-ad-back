module.exports = mongoose => {
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
    picture: {
      type: Buffer,
      required: false,
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
    }
  }, {
    timestamp: true
  })

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const Dish = mongoose.model('dish', schema)
  return Dish
}
