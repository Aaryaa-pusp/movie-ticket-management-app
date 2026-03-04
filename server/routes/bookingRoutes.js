import express from "express";
import {
    createBooking,
    verifyBooking,
    getUserBookings,
    getAllBookings,
} from "../controllers/bookingController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", createBooking);
router.post("/:id/verify", verifyBooking);
router.get("/user/:clerkId", getUserBookings);
router.get("/", adminAuth, getAllBookings);

export default router;
