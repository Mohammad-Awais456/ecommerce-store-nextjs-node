import Express from "express";
import { Authenticator,isAccountVerified,verifyRoles } from "../middleware/authentication.js";
import { getAllSettings, updateSettings,updateSettings_plus_logo } from "../Handlers/appSettingHandlers.js";
import { uploadProductImages } from "../middleware/multerConfig.js";

export const AppSettingRouter = Express.Router();


AppSettingRouter.route("/").get(getAllSettings);
AppSettingRouter.route("/update").patch(Authenticator,verifyRoles("admin"),uploadProductImages.array("logo",1),updateSettings_plus_logo);
AppSettingRouter.route("/:id").patch(Authenticator,verifyRoles("admin"),updateSettings);
