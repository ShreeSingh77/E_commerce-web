import { Router } from "express";
import { createOrder,getAllOrders,getMyOrders,
         updateOrderStatus,
         cancelOrder
 } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {verifyAdmin} from "../middlewares/admin.middleware.js";

const router = Router();

router.post("/create", verifyJWT, createOrder);

router.get("/my-order",verifyJWT,getMyOrders);
router.patch("/cancel/:orderId",verifyJWT,cancelOrder);
router.get("/",verifyJWT,verifyAdmin,getAllOrders);
router.patch("/:orderId/status",verifyJWT,verifyAdmin,updateOrderStatus);

export default router;