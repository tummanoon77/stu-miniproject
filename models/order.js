const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    customer:
    {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
    product:
    {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    Qty: Number,
    orderDate: {
        type: Date,
        default: Date.now
      },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
