const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  fname:String,
  lname:String,

  email: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },
  
  orders:[
      {
      type: Schema.Types.ObjectId,
      ref : "order"
      }
  ]
  
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
