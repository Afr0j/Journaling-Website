import { Router } from "express";
import {loginUser, logoutUser, registerUser} from "../controllers/user.controller.js";
import {verifyToken} from "../middlewares/auth.js";
import {regenerateAccessToken} from "../controllers/user.controller.js";

const router = Router();

//login route
router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(loginUser);

//register route
router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(registerUser); 

 
//secured routes
  router.post("/logout",verifyToken, logoutUser);

  router.post("/regenerateAccessToken", regenerateAccessToken);

export default router;
 