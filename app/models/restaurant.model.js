module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true
      },
      openingTime: {
        hours: { type: Number, min: 0, max: 24, required: true },
        minutes: { type: Number, min: 0, max: 60, required: true }
      },
      closingTime: {
        hours: { type: Number, min: 0, max: 24, required: true },
        minutes: { type: Number, min: 0, max: 60, required: true }
      },
      isClosedOverwrite: {
        type: Boolean,
        required: false,
        default: false
      },
      // $, $$, $$$, $$$$
      priceRange: {
        type: String,
        enum : ['$','$$', '$$$', '$$$$'],
        required: true
      },
      address: {
        streetName: String,
        streetNumber: Number,
        neighborhood: String,
        city: String,
        state: String,
        country: String,
        longitude: mongoose.Schema.Types.Decimal128,
        latitude: mongoose.Schema.Types.Decimal128
      },
      restaurantTypes: [
        {
          type: String,
          required: false
        }
      ],
      menuCategories: [
        {
          type: String,
          required: false
        }
      ],
      menu: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dish'
      }],
      reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
      }]
    },
    { timestamps: true }
  )

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const Restaurant = mongoose.model('restaurant', schema)
  return Restaurant
}
