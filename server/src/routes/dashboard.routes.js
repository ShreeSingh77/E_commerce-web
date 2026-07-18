import { Router } from "express";
import { getDashboardStats,
    getMonthlySales,
    getTopSellingProducts,
    getLowStockProducts
 } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.get(
    "/",
    verifyJWT,
    verifyAdmin,
    getDashboardStats
);

router.get("/monthly-sales",verifyJWT,verifyAdmin,getMonthlySales);

router.get("/top-products",verifyJWT,verifyAdmin,getTopSellingProducts);

router.get("/low-stock",verifyJWT,verifyAdmin,getLowStockProducts);
export default router;