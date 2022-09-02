module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      name: String,
      type: String
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
