import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        overview: { type: String, required: true },
        poster_path: { type: String, required: true },
        backdrop_path: { type: String },
        genres: [
            {
                id: Number,
                name: String,
            },
        ],
        casts: [
            {
                name: String,
                profile_path: String,
            },
        ],
        release_date: { type: String },
        original_language: { type: String, default: "en" },
        tagline: { type: String },
        vote_average: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
        runtime: { type: Number },
    },
    { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
