import express from "express";
import userRouter from "./routes/user.routes.js"
import cookieParser from "cookie-parser"
import categoryRouter from "./routes/category.routes.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/order.routes.js"
import wishlistRouter from "./routes/wishlist.routes.js"
import revievRouter from "./routes/review.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import  couponRouter from "./routes/coupon.routes.js";
  import addressRouter from "./routes/address.routes.js"

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users",userRouter);
app.use("/api/v1/categories",categoryRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/cart",cartRouter);
app.use("/api/v1/orders",orderRouter);
app.use("/api/v1/wishlist",wishlistRouter);
app.use("/api/v1/reviews",revievRouter);
app.use("/api/v1/admin/dashboard",dashboardRouter);
app.use("/api/v1/coupons",couponRouter);
app.use("/api/v1/address",addressRouter);


app.get("/", (req, res) => {
    res.send("Server is running...");
});

export default app;