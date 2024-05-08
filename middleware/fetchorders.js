var jwt = require('jsonwebtoken');
const JWT_SECRET = 'myname!sdev';

const fetchOrders = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
    try {
        const data= jwt.verify(token, JWT_SECRET);
    req.order = data.order;
    next();
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"}); 
    }
}



module.exports = fetchOrders;