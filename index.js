const connectToMongo = require("./db");
const express = require("express");
var cors = require('cors')

connectToMongo();
var app = express()
const port = 5000;

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
  res.send("Now, Receiving Order Api is live")
});
//Available Routes
app.use('/api/auth', require('./auth'))
app.use('/api/cancelauth', require('./routes/CancelAuth'))
app.use('/api/reaturnauth', require('./ReaturnAuth'))

app.listen(port, () => {
  console.log(`Orders Data Receiving Backend listening on port ${port}`);
});
