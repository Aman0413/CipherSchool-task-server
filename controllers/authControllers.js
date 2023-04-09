const User = require("../model/User");
const { success, error } = require("../utils/responseWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const store = require("store2");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.send(error(401, "All fields are required"));
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.send(error(400, "User is alreday registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.send(success(201, "User registered"));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(400, "All fields are required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.send(error(400, "User is not registered"));
    }
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res.send(error(400, "Invaild Credentails"));
    }

    const maxAge = 3 * 24 * 60 * 60;
    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      {
        expiresIn: maxAge,
      }
    );

    // res.cookie("jwt", accessToken, {
    //   witthCrdentials: true,
    //   httpOnly: false,
    //   maxAge: maxAge * 10,
    // });

    res.cookie("jwt", accessToken, {
      secure: true,
      sameSite: "Lax",
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      // 10 days
    });
    return res.send(success(200, { accessToken }));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

module.exports = {
  signup,
  login,
};
