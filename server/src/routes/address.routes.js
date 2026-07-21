import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addAddress,
    getMyAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress
 } from "../controllers/address.controller.js";

const router = Router();

router.route("/add").post(verifyJWT, addAddress);
router.route("/").get(verifyJWT,getMyAddresses);
router.route("/:addressId")
.patch(verifyJWT,updateAddress)
.delete(verifyJWT,deleteAddress);
router.route("/:addressId/default").patch(verifyJWT,setDefaultAddress);
export default router;