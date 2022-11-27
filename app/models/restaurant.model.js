module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true
      },
      openingTimes : {
        type : [Date],
      },
      closingTimes : {
        type : [Date],
      },
      // https://stackoverflow.com/questions/17460235/mongodb-opening-hours-schema-and-query-for-open-closed
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
      },
      pictures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'image'
      }]
    },
    { timestamps: true }
  )

  schema.index({ coordinates: '2dsphere' })

  schema.method('toJSON', async function () {
    await mongoose.model('restaurant').populate(this, {path: 'pictures'})
    const { __v, _id, ...object } = this.toObject()
    object.id = _id;
    object.averageRating = Number(object.averageRating);
    return object
  })

  const Restaurant = mongoose.model('restaurant', schema)
  return Restaurant
}
