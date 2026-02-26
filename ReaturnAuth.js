const express = require("express");
const OrderReturn = require("./OrderReturn");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchUser = require("./fetchorders");
const fetchOrders = require("./fetchorders");
const JWT_SECRET = "myname!sdev";

// Route 1=> post user details for signup using: POST "/api/auth/signup". No login required

router.post(
  "/returnorder",
  [
    body("email", "Enter a valid email address").isEmail(),
    body("phone", "Enter a Valid Phone Number").isLength({min: 10}),
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
      let orderreturn = await OrderReturn.findOne({ email: req.body.email });
      if (orderreturn) {
        return res.status(400).json({ success, error: "this email already exists!" });
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

      orderreturn = await OrderReturn.create({
        email: req.body.email,
        phone: req.body.phone,
      });
      const data = {
        orderreturn: {
          id: orderreturn.id,
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


router.get("/fetchAllReturnOrders", (req, res) => {
  OrderReturn.find()
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

// Route 5=> delete an existing account using: DELETE "/api/notes/deleteUser". login required

router.delete("/deleteReturnOrder/:id", async (req, res) => {
  try {
    // find the note to be deleted and delete it
    let orderreturnID = await OrderReturn.findById(req.params.id);
    if (!orderreturnID) {
      return res.status(404).send("User Not Found");
    }
    orderreturnID = await OrderReturn.findByIdAndDelete(req.params.id);
    res.json({ SUCCESS: "Order Returnlation has been deleted", orderreturnID: orderreturnID });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
