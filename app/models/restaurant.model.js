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

  schema.methods.toRestaurantCardObject = function toRestaurantCardObject(user = undefined){
    
    const { __v, _id, ...object } = this.toObject()

    const restCard = {
      name: object.name,
      address: object.address.streetName + ' ' + object.address.streetNumber,
      score: Number(object.averageRating).toFixed(2),
      restaurantId: _id,
      isFavorite: user ? user.favoriteRestaurants.includes(_id) : false,
      pictures : object.pictures.map(item => item.data.toString('base64'))
    }

    return restCard
  }

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id;
    object.averageRating = Number(object.averageRating);

    if (object.pictures.length > 0 && object.pictures[0].data)
      object.pictures = object.pictures.map(item => item.data.toString('base64'))
    else
      object.pictures = [];

    return object
  })

  const Restaurant = mongoose.model('restaurant', schema)
  return Restaurant
}
