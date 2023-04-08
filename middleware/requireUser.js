const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseWrapper");

const requireUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const deocode = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
    req.id = deocode._id;
    console.log("aman", deocode._id);
    next();
  } catch (err) {
    res.status(401).send("Unauthorized Access");
    console.log(err);
  }
};
module.exports = requireUser;
