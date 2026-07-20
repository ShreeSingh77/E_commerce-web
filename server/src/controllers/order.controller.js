import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Coupon } from "../models/coupon.model.js";
import {sendEmail } from "../utils/mail.service.js"
import mongoose from "mongoose";


const createOrder = asyncHandler(async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { couponCode } = req.body;

        const cartItems = await Cart.find({
            user: req.user._id
        })
            .populate("product")
            .session(session);
        const user =req.user;
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

        // Inventory Update
        for (const item of cartItems) {

            if (item.product.stock < item.quantity) {
                throw new ApiError(
                    400,
                    `${item.product.name} is out of stock or insufficient quantity available`
                );
            }

            item.product.stock -= item.quantity;

            await item.product.save({ session });
        }

        // Coupon
        let finalAmount = totalAmount;
        let appliedCoupon = null;

        if (couponCode) {

            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true
            }).session(session);

            if (!coupon) {
                throw new ApiError(404, "Invalid coupon");
            }

            if (coupon.expiryDate < new Date()) {
                throw new ApiError(400, "Coupon has expired");
            }

            const discountAmount =
                (totalAmount * coupon.discount) / 100;

            finalAmount = totalAmount - discountAmount;

            appliedCoupon = coupon.code;
        }

        const order = await Order.create(
            [
                {
                    user: req.user._id,
                    items,
                    totalAmount: finalAmount,
                    coupon: appliedCoupon
                }
            ],
            { session }
        );

        const createdOrder = order[0];

        await Cart.deleteMany(
            {
                user: req.user._id
            },
            { session }
        );

        await session.commitTransaction();
        await sendEmail(
    user.email,
    "Order Confirmed 🎉",
    `
        <h2>Hello ${user.fullName},</h2>

        <p>Your order has been placed successfully.</p>

        <p><strong>Order ID:</strong> ${createdOrder._id}</p>

        <p><strong>Total Amount:</strong> ₹${createdOrder.totalAmount}</p>

        <p>Thank you for shopping with us ❤️</p>
    `
);
        return res.status(201).json(
            new ApiResponse(
                201,
                createdOrder,
                "Order placed successfully"
            )
        );

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }

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