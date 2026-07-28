import { ApiError } from "../utils/ApiError.js";

const verifyAdmin = (req, res, next) => {

    console.log("Logged User:", req.user);
console.log("Role:", req.user.role);
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin only.");
    }

    next();
};

export { verifyAdmin };