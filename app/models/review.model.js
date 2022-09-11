module.exports = mongoose => {
  const schema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number, // 1-5
      required: true,
    },
    comment: {
      type: String, // can be empty
      required: false,
      default: null
    }
  }, {
    timestamp: true
  });
  
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  
  const Review = mongoose.model("review", schema);
  return Review;
};
