import { Router } from "express";
import { createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
     deleteProduct
 } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router
.route("/create")
.post(
    verifyJWT,
    verifyAdmin,
    upload.array("images",5),
    createProduct
    
);

router.route("/").get(getAllProducts);

router.route("/:productId")
.get(getProductById)
.patch(verifyJWT,verifyAdmin,updateProduct)
.delete(verifyJWT,verifyAdmin,deleteProduct);


export default router;