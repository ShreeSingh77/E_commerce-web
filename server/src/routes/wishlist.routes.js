import { Router } from "express";
import { addToWishlist ,
    getWishlist,
    removeFromWishlist
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/add",
    verifyJWT,
    addToWishlist
);
router.get("/",verifyJWT,getWishlist);
router.delete("/:wishlistId",verifyJWT,removeFromWishlist);

export default router;