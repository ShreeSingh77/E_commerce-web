import { Coupon } from "../models/coupon.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createCoupon = asyncHandler(async (req, res) => {

    const { code, discount, expiryDate } = req.body;

    if (!code || !discount || !expiryDate) {
        throw new ApiError(400, "All fields are required");
    }

    const existingCoupon = await Coupon.findOne({
        code: code.toUpperCase()
    });

    if (existingCoupon) {
        throw new ApiError(400, "Coupon already exists");
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discount,
        expiryDate
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            coupon,
            "Coupon created successfully"
        )
    );
});

const getAllCoupons = asyncHandler(async (req, res) => {

    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            coupons,
            "Coupons fetched successfully"
        )
    );
});

const updateCoupon = asyncHandler(async (req, res) => {

    const { couponId } = req.params;
    const { code, discount, expiryDate, isActive } = req.body;

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
        throw new ApiError(404, "Coupon not found");
    }

    if (code) {
        coupon.code = code.toUpperCase();
    }

    if (discount !== undefined) {
        coupon.discount = discount;
    }

    if (expiryDate) {
        coupon.expiryDate = expiryDate;
    }

    if (isActive !== undefined) {
        coupon.isActive = isActive;
    }

    await coupon.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            coupon,
            "Coupon updated successfully"
        )
    );
});

const deleteCoupon = asyncHandler(async (req, res) => {

    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
        throw new ApiError(404, "Coupon not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Coupon deleted successfully"
        )
    );
});

const applyCoupon = asyncHandler(async (req, res) => {

    const { code, totalAmount } = req.body;

    if (!code || !totalAmount) {
        throw new ApiError(400, "Coupon code and total amount are required");
    }

    const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true
    });

    if (!coupon) {
        throw new ApiError(404, "Invalid coupon");
    }

    if (coupon.expiryDate < new Date()) {
        throw new ApiError(400, "Coupon has expired");
    }

    const discountAmount = (totalAmount * coupon.discount) / 100;

    const finalAmount = totalAmount - discountAmount;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                originalAmount: totalAmount,
                discount: coupon.discount,
                discountAmount,
                finalAmount
            },
            "Coupon applied successfully"
        )
    );
});
export {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    applyCoupon
};