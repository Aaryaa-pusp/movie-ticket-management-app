// Admin authentication middleware
// Checks if the request is from the hardcoded admin user
export const adminAuth = (req, res, next) => {
    const clerkId = req.headers["clerk-id"];

    if (!clerkId || clerkId !== process.env.ADMIN_ID) {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }

    next();
};
