const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/api/getProducts", function (req, res) {
  db.Product.find({}).then(results => {
      res.json(results);
  });
});

app.get("/product/:id", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/product.html"));
});

app.get("/orders", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/orders.html"));
});

app.get("/api/getProduct/:id", function (req, res) {
  db.Product.find({ _id: req.params.id }).then(results => {
      res.json(results);
  });
});

app.get("/api/orders", function(req, res) {
  db.Order.find({}).populate("customer").populate("product").then(results => res.json(results));
});

app.post("/api/form/", ({ body }, res) => {
  // The data being submitted is for both the Order and Customer models, so I'm splitting it up here
  const orderData = { qty: body.quantity, product: body.productId }
  const customerData = { fname: body.name, lname: body.name, email: body.email }
  // The first step is to find the customer if he/she already exists, or to create a new one
  // A little research found the "upsert" option for findOneAndUpdate
  db.Customer.findOneAndUpdate(
      { email: body.email },
      customerData,
      { new: true, upsert: true }
      // One the customer is found/created, we can create the order, and put the customer _id into it
  ).then(function (newCustomerData) {
      orderData.customer = newCustomerData._id   // modifying the orderData object to include customer's _id
      db.Order.create(orderData)
          // Once the new order is created, we now UPDATE the new customer record with the order _id value
          // Note that my find query on the e-mail value; I think this is needed because the findAndUpdate() method
          // here does not have access to the original Customer first written above
          .then(function (newOrder) {
              db.Customer.findOneAndUpdate(
                  { email: body.email },
                  { $push: { orders: newOrder._id } },
                  { new: true }
              ).then(resp => {
                  if (resp && resp._id !== undefined) {
                      //res.json({ result: "success" })
                      res.sendFile(path.join(__dirname, "./public/index.html"));
                  } else {
                      res.status(400).json({ result: "fail" })
                  }
              })
          })
          .catch(err => {
              res.json(err)
          });
  });

  db.Product.findOne({ _id: body.productId }).then(product => {
    console.log("product inventory: " + product.inventory);
    if ((product.inventory - body.quantity) > 0) {
        db.Product.findOneAndUpdate({ _id: body.productId },
            { inventory: product.inventory - body.quantity }
        ).then(result => console.log(result));
    } else {
        res.send("Not enough inventory.");
    }
});
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/populatedb", { useNewUrlParser: true });



// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
db.products.insert({name: "Bike",description: "Two wheeled bike", price: "200", inventory: 10})
db.products.insert({name: "Speakers",description: "Large black speakers", price: "100", inventory: 20})
db.products.insert({name: "Coffee mug",description: "Ceramic coffee mug", price: "10", inventory: 15})
db.products.insert({name: "Water bottle",description: "Plastic water bottle", price: "5", inventory: 50})
db.products.insert({name: "Notebook",description: "Brown color notebook", price: "20", inventory: 30})