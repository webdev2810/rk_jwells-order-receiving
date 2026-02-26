const mongoose = require('mongoose');
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        // unique: true
    },
    phone:{
        type: String,
        required: true
    },
    // password:{
    //     type: String,
    //     required: true
    // },
    altPhone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    pincode:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    landmark:{
        type: String,
        required: true
    },
    productId:{
        type: String,
        required: true
    },
    Date:{
        type: Date,
        default: Date.now
    },
  });

  const Order = mongoose.model('order',OrderSchema);
  module.exports = Order;