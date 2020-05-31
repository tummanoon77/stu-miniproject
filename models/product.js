const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order"
    }
  ]
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
