import { Router } from "express";
import { createCoupon ,   
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    applyCoupon
} from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post(
    "/create",
    verifyJWT,
    verifyAdmin,
    createCoupon
  
);
router.get("/",verifyJWT,verifyAdmin,getAllCoupons);
router.put("/:couponId",verifyJWT,verifyAdmin,updateCoupon);
router.delete("/:couponId",verifyJWT,verifyAdmin,deleteCoupon);
router.post("/apply",verifyJWT,applyCoupon);


export default router;