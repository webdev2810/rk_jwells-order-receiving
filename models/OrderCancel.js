const mongoose = require('mongoose');
const Schema = mongoose.Schema

const OrderCancelSchema = new Schema({
    
    email:{
        type: String,
        required: true,
        // unique: true
    },
    phone:{
        type: String,
        required: true
    },
    // productId:{
    //     type: String,
    //     required: true
    // },
    Date:{
        type: Date,
        default: Date.now
    },
  });

  const OrderCancel = mongoose.model('ordercancel',OrderCancelSchema);
  module.exports = OrderCancel;