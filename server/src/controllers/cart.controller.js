import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToCart = asyncHandler(async (req, res) => {

    const { productId, quantity } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const existingCartItem = await Cart.findOne({
        user: req.user._id,
        product: productId
    });

    if (existingCartItem) {
        existingCartItem.quantity += quantity || 1;
        await existingCartItem.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                existingCartItem,
                "Cart updated successfully"
            )
        );
    }

    const cartItem = await Cart.create({
        user: req.user._id,
        product: productId,
        quantity: quantity || 1
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            cartItem,
            "Product added to cart successfully"
        )
    );
});

const getUserCart = asyncHandler(async(req,res)=>{
    const cart =await Cart.find({
        user:req.user._id
    })
    .populate({
        path:"product",
        populate:{
            path:"category",
            select:"name"
        }
    });

    return res
    .status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart fetched successfully"
        )
    )
});
const updateCartQuantity = asyncHandler(async (req, res) => {

    const { cartId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        throw new ApiError(400, "Quantity must be at least 1");
    }

    const cartItem = await Cart.findOne({
        _id: cartId,
        user: req.user._id
    });

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found");
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            cartItem,
            "Cart quantity updated successfully"
        )
    );
});

const removeFromCart = asyncHandler(async (req, res) => {

    const { cartId } = req.params;

    const cartItem = await Cart.findOneAndDelete({
        _id: cartId,
        user: req.user._id
    });

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Product removed from cart successfully"
        )
    );
});
const clearCart = asyncHandler(async (req, res) => {

    await Cart.deleteMany({
        user: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Cart cleared successfully"
        )
    );
});
export {
    addToCart,
 getUserCart ,
 updateCartQuantity  ,
 removeFromCart,
 clearCart  
};