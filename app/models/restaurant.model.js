module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true
      },
      // https://stackoverflow.com/questions/17460235/mongodb-opening-hours-schema-and-query-for-open-closed
      hours: {
        monday: {
          open: { type: Number, required: true, min: 0, max: 1440 },
          close: { type: Number, required: true, min: 0, max: 1440 }
        },
        tuesday: {
          open: { type: Number, required: true, min: 0, max: 1440 },
          close: { type: Number, required: true, min: 0, max: 1440 }
        },
        wednesday: {
          open: { type: Number, required: true, min: 0, max: 1440 },
          close: { type: Number, required: true, min: 0, max: 1440 }
        },
        thursday: {
          open: { type: Number, required: true, min: 0, max: 1440 },
          close: { type: Number, required: true, min: 0, max: 1440 }
        },
        friday: {
          open: { type: Number, required: true, min: 0, max: 1440 },
          close: { type: Number, required: true, min: 0, max: 1440 }
        },
        saturday: {
          open: { type: Number, required: true, min: 0, max: 1440 },
          close: { type: Number, required: true, min: 0, max: 1440 }
        },
        sunday: {
          open: { type: Number, required: true, min: 0, max: 1440 },
          close: { type: Number, required: true, min: 0, max: 1440 }
        }
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
    object.id = _id
    return object
  })

  const Restaurant = mongoose.model('restaurant', schema)
  return Restaurant
}
