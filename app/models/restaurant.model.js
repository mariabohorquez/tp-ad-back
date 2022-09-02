module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true
      },
      openingTime:{
        type: Date,
        required: true,
      },
      closingTime:{
        type: Date,
        required: true,
      },
      priceRange:{
        type: String,
        required: true
      },
      address:{
        streetName: String,
        streetNumber: Integer,
        neighborhood: String,
        city: String,
        state: String,
        country: String,
      },
      categories:[
        {
          type:String,
          required: true,
        }
      ],
      menu:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'menu'
      }]  
    },
    { timestamps: true }
    );
    
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    
    const Restaurant = mongoose.model("restaurant", schema);
    return Restaurant;
  };
