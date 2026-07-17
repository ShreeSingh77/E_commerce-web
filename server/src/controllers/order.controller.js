import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOrder = asyncHandler(async (req, res) => {

    const cartItems = await Cart.find({ user: req.user._id }).populate("product");

    if (!cartItems.length) {
        throw new ApiError(400, "Cart is empty");
    }

    let totalAmount = 0;

    const items = cartItems.map((item) => {
        totalAmount += item.product.price * item.quantity;

        return {
            product: item.product._id,
            quantity: item.quantity
        };
    });

    const order = await Order.create({
        user: req.user._id,
        items,
        totalAmount
    });

    await Cart.deleteMany({ user: req.user._id });

    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "Order placed successfully"
        )
    );
});

const getMyOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find({
        user: req.user._id
    })
    .populate("items.product", "name price images")
    .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "Orders fetched successfully"
        )
    );
});

const getAllOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find()
        .populate("user", "fullName email")
        .populate("items.product", "name price")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "All orders fetched successfully"
        )
    );
});

const updateOrderStatus=asyncHandler(async(req,res)=>{
    const {orderId} =req.params;
    const {status} =req.body;

    const allowedStatus = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    if(!allowedStatus.includes(status)){
        throw new ApiError(400,"Invalid order status");

    }

    const order = await Order.findById(orderId);

    if(!order){
        throw new ApiError(404,"Order not found");
    }
    order.status = status;

    await order.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            order,
            "Order status updated successfully"
        )
    );
});
export {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus

};