import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToWishlist = asyncHandler(async (req, res) => {

    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const alreadyExists = await Wishlist.findOne({
        user: req.user._id,
        product: productId
    });

    if (alreadyExists) {
        throw new ApiError(400, "Product already exists in wishlist");
    }

    const wishlist = await Wishlist.create({
        user: req.user._id,
        product: productId
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            wishlist,
            "Product added to wishlist successfully"
        )
    );
});
const getWishlist = asyncHandler(async (req, res) => {

    const wishlist = await Wishlist.find({
        user: req.user._id
    })
    .populate({
        path: "product",
        populate: {
            path: "category",
            select: "name"
        }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            wishlist,
            "Wishlist fetched successfully"
        )
    );
});

const removeFromWishlist = asyncHandler(async(req,res)=>{
    const {wishlistId} =req.params;

    const wishlist =await Wishlist.findByIdAndDelete({
        _id:wishlistId,
        user:req.user._id
    });

    if(!wishlist){
        throw new ApiError(404, "Wishlist item not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Product removed from wishlist successfully"
    )
);
});



export {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};