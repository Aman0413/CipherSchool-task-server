const route = require("express").Router();
const userController = require("../controllers/userControllers");
const requireUser = require("../middleware/requireUser");

route.get("/allUser", requireUser, userController.getAllUser);
route.post("/update", requireUser, userController.updatePersonalDetails);
route.post("/follow", requireUser, userController.followAndUnfollowUser);
route.post("/addInterest", requireUser, userController.addInterest);
route.get("/getMyInfo", requireUser, userController.getMyData);
route.post("/updateAboutMe", requireUser, userController.updateAboutMe);
route.post("/changePassword", requireUser, userController.changePassword);
route.post("/logout", requireUser, userController.logout);
route.get("/singleUser", requireUser, userController.singleUser);

module.exports = route;
