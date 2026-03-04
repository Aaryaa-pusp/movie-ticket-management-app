import express from "express";
import {
    clerkWebhook,
    getUserByClerkId,
    toggleFavourite,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/webhook", clerkWebhook);
router.get("/:clerkId", getUserByClerkId);
router.put("/:clerkId/favourites", toggleFavourite);

export default router;
