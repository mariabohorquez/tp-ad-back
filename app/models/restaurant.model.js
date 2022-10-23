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
        enum: ['$', '$$', '$$$', '$$$$'],
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
      coordinates: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
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
      }],
      averageRating: {
        type: mongoose.Schema.Types.Decimal128,
        required: false,
        default: 0
      }
    },
    { timestamps: true }
  )

  schema.index({ coordinates: '2dsphere' })

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const Restaurant = mongoose.model('restaurant', schema)
  return Restaurant
}
