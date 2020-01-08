var express = require("express");

var router = express.Router();


var path = require("path")
var products = require("../models/product");

// HOME PAGE
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/../public/index.html"));
});
// SELLER PAGE
router.get("/seller", function (req, res) {
  console.log("test")
  res.sendFile(path.join(__dirname, "/../public/seller.html"));
});
// BUYER PAGE
router.get("/buyer", function (req, res) {
  console.log("test")
  res.sendFile(path.join(__dirname, "/../public/buyer.html"));
});
// PRODUCT API
router.get("/products_api", function (req, res) {
  products.all(function (data) {
    res.json({ product: data });
  });
});
  //POST PRODUCTS
router.post("/products_api", function(req, res) {
  console.log(req.body)
  products.create([
    "product_name", "product_description", "product_image","highest_bid", "seller_name", "seller_phone", "bid_length"
  ], [
    req.body.product_name, req.body.product_description, req.body.product_image ,req.body.highest_bid, req.body.seller_name, req.body.seller_phone, req.body.bid_length
  ], function(result) {
    // Send back the ID of the new quote
    // res.json({ id: result.insertId });
    console.log(result)
  });
});
//Twilio
router.post("/send_sms", function(req, res){
  console.log(req.body.seller_phone)
          // twilio api 
        // var twilio = require('twilio');
        // console.log("seller phone ="+newProduct.seller_phone)
        const accountSid = 'AC290f13a79685d52e994487b6f26d295a';
        const authToken = 'af747a82a522f6278cdf9a2a0d0776f8';
        var twilio = require('twilio');
        var client = new twilio (accountSid, authToken);
        client.messages
            .create({
                body: 'Its working!',
                from: '+12012672107',
                to: '+1' + req.body.seller_phone
            })
            .then(message => res.json(message));
        //   twilio api
});

 //POST buyers
 router.put("/products_api/:id", function(req, res) {
  console.log("Buyer Update")
  var condition = "product_id = " +req.params.id;
  console.log("condition", condition);
  products.update({
    // [
    highest_bid: req.body.highest_bid,
    buyer_name: req.body.buyer_name,
    buyer_phone: req.body.buyer_phone,
    // moment_bid: req.body.moment_bid
}, condition, function(result) {
    console.log(result)
  });
});

router.delete("/products_api/:id", function(req, res) {
  var condition = "product_id = " + req.params.id;

  products.delete(condition, function(result) {
    if (result.affectedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

module.exports = router;

