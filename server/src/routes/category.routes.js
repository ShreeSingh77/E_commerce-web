import { Router } from "express";
import { createCategory ,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";


const router =Router();

router.route("/create").post(
    verifyJWT,
    verifyAdmin,
    createCategory
);

router.route("/").get(getAllCategories);

router.route("/:categoryId")
.get(getCategoryById)
.patch(verifyJWT,verifyAdmin,updateCategory)
.delete(verifyJWT,verifyAdmin,deleteCategory);


export default router;