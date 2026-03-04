import express from "express";
import {
    getAllShows,
    getShowById,
    createShow,
    deleteShow,
} from "../controllers/showController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getAllShows);
router.get("/:id", getShowById);
router.post("/", adminAuth, createShow);
router.delete("/:id", adminAuth, deleteShow);

export default router;
