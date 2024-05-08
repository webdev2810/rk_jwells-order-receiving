const mongoose = require('mongoose');
const Schema = mongoose.Schema

const OrderReturnSchema = new Schema({
    
    email:{
        type: String,
        required: true,
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

  const OrderReturn = mongoose.model('orderreturn',OrderReturnSchema);
  module.exports = OrderReturn;