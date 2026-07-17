import express from "express";
import userRouter from "./routes/user.routes.js"
import cookieParser from "cookie-parser"
import categoryRouter from "./routes/category.routes.js"
import productRouter from "./routes/product.routes.js"

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users",userRouter);
app.use("/api/v1/categories",categoryRouter);
app.use("/api/v1/products",productRouter);


app.get("/", (req, res) => {
    res.send("Server is running...");
});

export default app;