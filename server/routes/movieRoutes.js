import express from "express";
import { getAllMovies, getMovieById, searchMovies } from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieById);

export default router;
