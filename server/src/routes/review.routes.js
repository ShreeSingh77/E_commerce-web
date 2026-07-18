import { Router } from "express";
import { addReview ,
    getProductReviews,
    updateReview,
    deleteReview

} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/add",
    verifyJWT,
    addReview
);

router.get("/:productId",getProductReviews);

router.patch("/:reviewId",verifyJWT,updateReview);

router.delete("/:reviewId",verifyJWT,deleteReview);
export default router;