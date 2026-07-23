
import express from "express";
const router = express.Router();
import { GetUserController, registerUser,GetUserByIdController ,LogoutUserController,UpdateuserprofileController,followandUnfollowController,GetUserallController, LoginUserDataController} from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import IsAUTh from "../middlewares/Auth.js";
import uploadUserPicture from "../middlewares/MuterforUser.js";
import { Prompt_send_toPython,DemucsMusic_Vocalseparated_AiController } from "../controllers/AI.controller.js";
import upload from "../middlewares/AImulter.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getuser", IsAUTh, GetUserController);
router.get("/getuser/:id", IsAUTh, GetUserByIdController);
router.get("/getallusers", IsAUTh, GetUserallController);
router.get("/GetUserById/:id", IsAUTh, GetUserByIdController);
router.post("/follow", IsAUTh, followandUnfollowController);
router.put("/update-profile", IsAUTh, uploadUserPicture,UpdateuserprofileController);
router.get("/loginUser",IsAUTh,LoginUserDataController)

router.post("/Prompt_send_toPython",IsAUTh,Prompt_send_toPython)
router.post("/Karoke_send_toPython",IsAUTh,upload,DemucsMusic_Vocalseparated_AiController)
router.post("/logout",IsAUTh,LogoutUserController)

export default router;
