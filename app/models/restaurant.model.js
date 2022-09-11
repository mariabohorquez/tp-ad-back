module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true
      },
      openingTime: {
        hours: Number,
        minutes: Number
      },
      closingTime: {
        hours: Number,
        minutes: Number
      },
      isClosedOverwrite: {
        type: Boolean,
        required: false,
        default: false
      },
      // $, $$, $$$, $$$$
      priceRange: {
        type: String,
        required: true
      },
      address: {
        streetName: String,
        streetNumber: Number,
        neighborhood: String,
        city: String,
        state: String,
        country: String
      },
      // Force this to be some pre-approved types
      restaurantTypes: [
        {
          type: String,
          required: true
        }
      ],
      menuCategories: [
        {
          type: String,
          required: true
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
