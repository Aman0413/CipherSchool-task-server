const User = require("../model/User");
const { error, success } = require("../utils/responseWrapper");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find();
    return res.send(success(200, allUser));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const getMyData = async (req, res) => {
  try {
    const id = req.id;
    console.log(id);
    const user = await User.findById(id);
    return res.send(success(200, user));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const updatePersonalDetails = async (req, res) => {
  try {
    const { firstName, lastName, email, number, image } = req.body;

    const id = req.id;

    if (!id) {
      return res.send(error(400, "Id is required"));
    }

    const imageRes = await cloudinary.uploader.upload(image, {
      folder: "cipherSchool-profile-images",
    });

    if (!imageRes) {
      return res.send(error(400, "Images upload failed"));
    }

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      number,
      avatar: {
        publicId: imageRes.public_id,
        url: imageRes.secure_url,
      },
    });

    return res.send(success(200, "Details Updated"));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const followAndUnfollowUser = async (req, res) => {
  try {
    const curUserId = req.id;
    const { userIdToFollow } = req.body;

    const userToFollow = await User.findById(userIdToFollow);
    const curUser = await User.findById(curUserId);

    if (curUserId === userIdToFollow) {
      return res.send(error(409, "Users cannot follow themselves"));
    }

    if (!userToFollow) {
      return res.send(error(404, "User to follow not found"));
    }

    if (curUser.followings.includes(userIdToFollow)) {
      // already followed
      const followingIndex = curUser.followings.indexOf(userIdToFollow);
      curUser.followings.splice(followingIndex, 1);

      const followerIndex = userToFollow.followers.indexOf(curUser);
      userToFollow.followers.splice(followerIndex, 1);
    } else {
      userToFollow.followers.push(curUserId);
      curUser.followings.push(userIdToFollow);
    }

    await userToFollow.save();
    await curUser.save();

    return res.send(success(200, { user: userToFollow }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const addInterest = async (req, res) => {
  try {
    id = req.id;
    const { interest } = req.body;

    if (!id) {
      return res.send(error(400, "Id is required"));
    }

    const user = await User.findByIdAndDelete(id, {
      interest,
    });

    return res.send(200, user);
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const updateAboutMe = async (req, res) => {
  try {
    const { aboutMe } = req.body;

    const id = req.id;

    const user = await User.findByIdAndUpdate(id, {
      aboutMe,
    });

    if (!user) {
      return res.send(error(400, "Not Updated"));
    }
    return res.send(success(200, "Updated"));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const changePassword = async (req, res) => {
  try {
    const { new_password } = req.body;

    id = req.id;
    if (!id) {
      return res.send(error(400, "Id is required"));
    }

    const hasedPassword = await bcrypt.hash(new_password, 10);

    const user = User.findByIdAndUpdate(id, {
      password: hasedPassword,
    });

    return res.send(success(200, "Password Changed"));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const logout = async (req, res) => {
  id = req.id;
  res.clearCookie("jwt");
  return res.send(success(200, "Logout"));
};

const singleUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.send(error(400, "User Not Found"));
    }
    return res.send(success(200, user));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};
module.exports = {
  getAllUser,
  updatePersonalDetails,
  followAndUnfollowUser,
  addInterest,
  getMyData,
  updateAboutMe,
  changePassword,
  logout,
  singleUser,
};
