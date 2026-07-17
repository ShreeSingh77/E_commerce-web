import { Router } from "express";
import { addToCart,
    getUserCart,
    updateCartQuantity ,
    removeFromCart,
    clearCart

 } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/add").post(
    verifyJWT,
    addToCart
);
router.route("/").get(verifyJWT,getUserCart);

router.route("/:cartId").patch(verifyJWT,updateCartQuantity);
router.delete("/clear/all",verifyJWT,clearCart);

router.delete("/:cartId",verifyJWT,removeFromCart);

export default router;