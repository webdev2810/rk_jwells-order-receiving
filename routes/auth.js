const express = require("express");
const Order = require("../Order");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchUser = require("../fetchorders");
const fetchOrders = require("../fetchorders");
const JWT_SECRET = "myname!sdev";
// const RecOrd = require("../models/RecOrder");
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const RecOrderSchema = new Schema({
  id:String,
  name:String,
  color:String,
  email:String,
  amount:Number,
  status:String,
  link:String,
  description:String,
  image:String,
  price:Number,
  max:Number,
  date:{
    type: Date,
    default: Date.now
},
});

const Product = mongoose.model('Product',RecOrderSchema);

// Route 1=> post user details for signup using: POST "/api/auth/signup". No login required

router.post(
  "/orders",
  [
    body("name", "Enter a Valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email address").isEmail(),
    body("address", "Enter the Children's Resedential Address").notEmpty(),
    body("pincode", "Enter the Pincode").isLength({ min: 3 }),
    // body("password", "Set a strong password").isLength({ min: 6 }),
    body("city", "Enter Your City").isLength({ min: 3 }),
    body("state", "Enter Your State").isLength({ min: 3 }),
    body("country", "Enter Your Country").isLength({ min: 3 }),
    body("landmark", "Enter Any near by post office, market, Hospital as the Landmark").isLength({ min: 3 }),
    body("phone", "Enter a Valid Phone Number").isLength({min: 10}),
    body("altPhone", "Enter another Valid Phone Number").isLength({min: 10}),
    body("productId", "Enter the valid Captcha"),
  ],
  async (req, res) => {
    let success=false;
    // If there are errors, return bad request and the error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: result.array() });
    }
    try {
      // check the user with this email address already exists or not
      let ordermail = await Order.findOne({ email: req.body.email });
      if (ordermail) {
        return res.status(400).json({ success, error: "Next ordering when your previous order shipped !" });
      }
      // let Cpass = confirmPassword;
      // if (Cpass != password) {
      //   return res.status(400).json({ success, error: "Must be same as your password" });
      // }
      // let Gph= await parentPhone.compare({guardianPhone: req.body.guardianPhone});
      // if (Gph == parentPhone) {
      //   return res.status(400).json({ success, error: "Phone Number must be different" });
      // // }
      // const saltRounds = await 10;
      // const salt = await bcrypt.genSaltSync(saltRounds);
      // const SecretePass = await bcrypt.hashSync(req.body.password, salt);

     let order = await Order.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        altPhone: req.body.altPhone,
        address: req.body.address,
        pincode: req.body.pincode,
        state: req.body.state,
        city: req.body.city,
        country: req.body.country,
        landmark: req.body.landmark,
        productId: req.body.productId,
      });
      const data = {
        order: {
          id: order.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


router.get("/fetchAllOrders", (req, res) => {
  Order.find()
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error occured",
      });
    });
});

router.get("/getOrder/:id", async (req, res) => {
  try {
    // find the note to be deleted and delete it
    let orderID = await Order.findById(req.params.id);
    if (!orderID) {
      return res.status(404).send("User Not Found");
    }
    // orderID = await Order.findByIdAndDelete(req.params.id);
    res.json({orderID: orderID });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/selected-product', async (req, res) => {
  const selectedProducts = req.body;
  console.log('Received selected products:', selectedProducts);

  try {
    // Save the selected products to the database
    await Product.insertMany(selectedProducts);
    console.log('Products details saved');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving products details:', error);
    res.sendStatus(500);
  }
});

router.get('/fetchselectedproducts/:key',async (req, res) => {
  console.log(req.params.key);
  let data = await Product.find(
    {
      "$or":[
        {"email":{$regex:req.params.key}}
      ]
    }
  )
  res.send(data)
});
// router.get('/fetchselectedproducts/:password', (req, res) => {
//   const productPassword = req.params.password;
//   const product = Product.find(product => product.password === productPassword);
//   if (product) {
//     // Return only necessary details, excluding the password
//     const { id, name, color, amount, description, image, price, max } = product;
//     res.json({ id, name, color, amount, description, image, price, max });
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// });


router.get('/fetchselected-products', async (req, res) => {
  try {
    const selectedProducts = await Product.find();
    console.log('Selected products retrieved:', selectedProducts);
    res.json(selectedProducts.reverse());
  } catch (error) {
    console.error('Error retrieving selected products:', error);
    res.sendStatus(500);
  }
});

router.put("/updateselected-products/:id", async (req, res) => {
  try {
    const {status} = req.body;
    const {link} = req.body;
    const {email} = req.body;
    // Create a newNote object
    const newDet = {};
    if (status) {
      newDet.status = status;
    }
    if (link) {
      newDet.link = link;
    }
    if (email) {
      newDet.email = email;
    }
    // find the note to be updated and update it
    let det = await Product.findById(req.params.id);
    if (!det) {
      return res.status(404).send("Not Found");
    }
    det = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: newDet },
      { new: true }
    );
    res.json({ det });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// router.get("/fetchAllRecOrders", (req, res) => {
//   selectedProduct.find()
//     .then((response) => {
//       res.json({
//         response,
//       });
//     })
//     .catch((error) => {
//       res.json({
//         message: "An error occured",
//       });
//     });
// });

// let orders = [];

// router.post('/placedorders', (req, res) => {
//   const { cart } = req.body;
//   // Process the order (e.g., update inventory, calculate total amount)
//   // const orderDetails = {
//   //   id: orders.length + 1,
//   //   items: cart,
//   //   // total: cart.reduce((acc, item) => acc + item.price, 0)
//   // };
//   orders.push(cart);
//   console.log('Order placed:', cart);
//   res.send('Order placed successfully');
// });


// router.get('/getOrder', async (req, res) => {
//   let ordersID = await orders;

//   res.json({ordersID: ordersID });
// })

// router.get('order/:id', (req, res) => {
//   const orderId = parseInt(req.params.id);
//   const order = Order.find(o => o.id === orderId);

//   if (order) {
//     res.send(order);
//   } else {
//     res.status(404).send({ error: 'Order not found' });
//   }
// });

// Route 5=> delete an existing account using: DELETE "/api/notes/deleteUser". login required

router.delete("/deleteOrder/:id", async (req, res) => {
  try {
    // find the note to be deleted and delete it
    let orderID = await Order.findById(req.params.id);
    if (!orderID) {
      return res.status(404).send("User Not Found");
    }
    orderID = await Order.findByIdAndDelete(req.params.id);
    res.json({ SUCCESS: "Order has been deleted", orderID: orderID });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.delete("/deleteSelectedOrder/:id", async (req, res) => {
  try {
    // find the note to be deleted and delete it
    let orderID = await Product.findById(req.params.id);
    if (!orderID) {
      return res.status(404).send("User Not Found");
    }
    orderID = await Product.findByIdAndDelete(req.params.id);
    res.json({ SUCCESS: "Product has been deleted", orderID: orderID });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
