import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { Order } from "../models/order.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalCategories = await Category.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
        status: "Pending"
    });

    const deliveredOrders = await Order.countDocuments({
        status: "Delivered"
    });

    const revenue = await Order.aggregate([
        {
            $match: {
                status: "Delivered"
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$totalAmount"
                }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalUsers,
                totalProducts,
                totalCategories,
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue: revenue[0]?.totalRevenue || 0
            },
            "Dashboard stats fetched successfully"
        )
    );
});

const getMonthlySales = asyncHandler(async (req, res) => {

    const monthlySales = await Order.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalSales: {
                    $sum: "$totalAmount"
                },
                totalOrders: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            monthlySales,
            "Monthly sales fetched successfully"
        )
    );
});

const getTopSellingProducts = asyncHandler(async (req, res) => {

    const topProducts = await Order.aggregate([
        {
            $unwind: "$items"
        },
        {
            $group: {
                _id: "$items.product",
                totalSold: {
                    $sum: "$items.quantity"
                }
            }
        },
        {
            $sort: {
                totalSold: -1
            }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $unwind: "$product"
        },
        {
            $project: {
                _id: 1,
                productName: "$product.name",
                price: "$product.price",
                totalSold: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            topProducts,
            "Top selling products fetched successfully"
        )
    );
});
const getLowStockProducts = asyncHandler(async (req, res) => {

    const lowStockProducts = await Product.find({
        stock: { $lte: 5 }
    })
    .select("name stock price category")
    .populate("category", "name");

    return res.status(200).json(
        new ApiResponse(
            200,
            lowStockProducts,
            "Low stock products fetched successfully"
        )
    );
});
export {
    getDashboardStats,
    getMonthlySales,
    getTopSellingProducts,
    getLowStockProducts
};