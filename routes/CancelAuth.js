const express = require("express");
const OrderCancel = require("../OrderCancel");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchUser = require("../fetchorders");
const fetchOrders = require("../fetchorders");
const JWT_SECRET = "myname!sdev";

// Route 1=> post user details for signup using: POST "/api/auth/signup". No login required

router.post(
  "/cancelorder",
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
      let ordercancel = await OrderCancel.findOne({ email: req.body.email });
      if (ordercancel) {
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

      ordercancel = await OrderCancel.create({
        email: req.body.email,
        phone: req.body.phone,
      });
      const data = {
        ordercancel: {
          id: ordercancel.id,
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


router.get("/fetchAllCancelOrders", (req, res) => {
  OrderCancel.find()
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

router.delete("/deleteCancelOrder/:id", async (req, res) => {
  try {
    // find the note to be deleted and delete it
    let ordercancelID = await OrderCancel.findById(req.params.id);
    if (!ordercancelID) {
      return res.status(404).send("User Not Found");
    }
    ordercancelID = await OrderCancel.findByIdAndDelete(req.params.id);
    res.json({ SUCCESS: "Order Cancellation has been deleted", ordercancelID: ordercancelID });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
