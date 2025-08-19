import Express from "express";
import { findLostEmail, isLogin, isUserExists, loginUser, logoutUser, registerUser, resetPassword, sendVerificationToken, verfiyAccount, UpdateProfile,getAllUser,deleteUser } from "../Handlers/userHandler.js";
import { Authenticator, verifyRoles } from "../middleware/authentication.js";

export const userRouter = Express.Router();


userRouter.route("/register").post(registerUser);
userRouter.route("/is-login").post(Authenticator,isLogin);
userRouter.route("/profile").patch(Authenticator,UpdateProfile);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(Authenticator,logoutUser);
userRouter.route("/is-username-exists").post(isUserExists);
userRouter.route("/users").get(Authenticator,verifyRoles("admin"),getAllUser);
userRouter.route("/:id").delete(Authenticator,verifyRoles("admin"),deleteUser);
userRouter.route("/request-token").post(sendVerificationToken);
userRouter.route("/reset-password").post(resetPassword);
userRouter.route("/find-email").post(findLostEmail);
userRouter.route("/verify-account").post(Authenticator,verfiyAccount);


