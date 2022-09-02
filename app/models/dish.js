module.exports = mongoose => {
  const schema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      unique: false,
    },
    price: {
      type: Decimal128,
      required: true,
      unique: false,
    },
    picture: {
      type: Buffer,
      required: false,
      unique: false,
    },
    ingredients: {
      type: String,
      required: true,
      unique: false,
    },
    isVegan: {
      type: Boolean,
      required: false,
      unique: false,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      required: false,
      unique: false,
      default: false,
    }
  }, {
    timestamp: true
  });
  
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  
  const Owner = mongoose.model("owner", schema);
  return Owner;
};
