const mongoose = require('mongoose');
const Schema = mongoose.Schema

const RecOrderSchema = new Schema({
    // id:String,
    id:{
      type: String,
  },
    name:{
      type: String,
  },
    color:{
      type: String,
  },
    amount:{
      type: Number,
  },
    image:{
      type: String,
  },
    price:{
      type: Number,
  },
    max:{
      type: Number,
  },
  });

  const RecOrd = mongoose.model('recorder',RecOrderSchema);
  module.exports = RecOrd;