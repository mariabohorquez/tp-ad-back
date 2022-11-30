module.exports = mongoose => {
  const ImageSchema = mongoose.Schema({
    fileName: String,
    type: String,
    uri: Buffer,
  });

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
      pictures : [ImageSchema]
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
      pictures : object.pictures = object.pictures.map(item => {
        const newItem = {
          fileName : item.fileName,
          type : item.type,
          id : item._id,
          uri : item.uri.toString('base64')
        }
        return newItem;
      })
    }

    return restCard
  }

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id;
    object.averageRating = Number(object.averageRating).toFixed(2);

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

  const Restaurant = mongoose.model('restaurant', schema)
  return Restaurant
}
