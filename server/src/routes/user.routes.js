import {Router} from "express";
import {registerUser, 
    loginUser,
    logoutUser, 
    getCurrentUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    forgotPassword,
    resetPassword
}
     from "../controllers/user.controller.js"
import {upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";


const router =Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logOut").post(verifyJWT ,logoutUser);
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/update-account").patch(verifyJWT,updateAccountDetails);
router.route("/forget-password").post(forgotPassword);
router.route("/forget-password/:token").post(resetPassword);

router.route("/avatar").patch(verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);


router.route("/cover-image").patch(verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
);

// router.post("/product", verifyJWT,
//     verifyAdmin,
//     createProduct
// )



export default router;

