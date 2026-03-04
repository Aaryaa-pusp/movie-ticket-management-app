import mongoose from "mongoose";
import "dotenv/config";
import Movie from "./models/Movie.js";
import Show from "./models/Show.js";

const dummyMovies = [
    {
        title: "In the Lost Lands",
        overview: "A queen sends the powerful and feared sorceress Gray Alys to the ghostly wilderness of the Lost Lands in search of a magical power, where she and her guide, the drifter Boyce, must outwit and outfight both man and demon.",
        poster_path: "https://image.tmdb.org/t/p/original/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/op3qmNhvwEvyT7UFyPbIfQmKriB.jpg",
        genres: [{ id: 28, name: "Action" }, { id: 14, name: "Fantasy" }, { id: 12, name: "Adventure" }],
        casts: [{ name: "Milla Jovovich", profile_path: "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg" }, { name: "Dave Bautista", profile_path: "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg" }],
        release_date: "2025-02-27",
        original_language: "en",
        tagline: "She seeks the power to free her people.",
        vote_average: 6.4,
        vote_count: 15000,
        runtime: 102,
    },
    {
        title: "Until Dawn",
        overview: "One year after her sister Melanie mysteriously disappeared, Clover and her friends head into the remote valley where she vanished in search of answers.",
        poster_path: "https://image.tmdb.org/t/p/original/juA4IWO52Fecx8lhAsxmDgy3M3.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/icFWIk1KfkWLZnugZAJEDauNZ94.jpg",
        genres: [{ id: 27, name: "Horror" }, { id: 9648, name: "Mystery" }],
        casts: [{ name: "Milla Jovovich", profile_path: "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg" }],
        release_date: "2025-04-23",
        original_language: "en",
        tagline: "Every night a different nightmare.",
        vote_average: 6.4,
        vote_count: 18000,
        runtime: 103,
    },
    {
        title: "Lilo & Stitch",
        overview: "The wildly funny and touching story of a lonely Hawaiian girl and the fugitive alien who helps to mend her broken family.",
        poster_path: "https://image.tmdb.org/t/p/original/mKKqV23MQ0uakJS8OCE2TfV5jNS.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg",
        genres: [{ id: 10751, name: "Family" }, { id: 35, name: "Comedy" }, { id: 878, name: "Science Fiction" }],
        casts: [{ name: "Milla Jovovich", profile_path: "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg" }],
        release_date: "2025-05-17",
        original_language: "en",
        tagline: "Hold on to your coconuts.",
        vote_average: 7.1,
        vote_count: 27500,
        runtime: 108,
    },
    {
        title: "Havoc",
        overview: "When a drug heist swerves lethally out of control, a jaded cop fights his way through a corrupt city's criminal underworld to save a politician's son.",
        poster_path: "https://image.tmdb.org/t/p/original/ubP2OsF3GlfqYPvXyLw9d78djGX.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/65MVgDa6YjSdqzh7YOA04mYkioo.jpg",
        genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }, { id: 53, name: "Thriller" }],
        casts: [{ name: "Dave Bautista", profile_path: "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg" }],
        release_date: "2025-04-25",
        original_language: "en",
        tagline: "No law. Only disorder.",
        vote_average: 6.5,
        vote_count: 35960,
        runtime: 107,
    },
    {
        title: "A Minecraft Movie",
        overview: "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld.",
        poster_path: "https://image.tmdb.org/t/p/original/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/2Nti3gYAX513wvhp8IiLL6ZDyOm.jpg",
        genres: [{ id: 10751, name: "Family" }, { id: 35, name: "Comedy" }, { id: 12, name: "Adventure" }],
        casts: [{ name: "Dave Bautista", profile_path: "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg" }],
        release_date: "2025-03-31",
        original_language: "en",
        tagline: "Be there and be square.",
        vote_average: 6.5,
        vote_count: 15225,
        runtime: 101,
    },
    {
        title: "Mission: Impossible - The Final Reckoning",
        overview: "Ethan Hunt and team continue their search for the terrifying AI known as the Entity.",
        poster_path: "https://image.tmdb.org/t/p/original/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/1p5aI299YBnqrEEvVGJERk2MXXb.jpg",
        genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 53, name: "Thriller" }],
        casts: [{ name: "Milla Jovovich", profile_path: "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg" }],
        release_date: "2025-05-17",
        original_language: "en",
        tagline: "Our lives are the sum of our choices.",
        vote_average: 7.0,
        vote_count: 19885,
        runtime: 170,
    },
    {
        title: "Thunderbolts*",
        overview: "After finding themselves ensnared in a death trap, seven disillusioned castoffs must embark on a dangerous mission.",
        poster_path: "https://image.tmdb.org/t/p/original/m9EtP1Yrzv6v7dMaC9mRaGhd1um.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/rthMuZfFv4fqEU4JVbgSW9wQ8rs.jpg",
        genres: [{ id: 28, name: "Action" }, { id: 878, name: "Science Fiction" }, { id: 12, name: "Adventure" }],
        casts: [{ name: "Dave Bautista", profile_path: "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg" }],
        release_date: "2025-04-30",
        original_language: "en",
        tagline: "Everyone deserves a second shot.",
        vote_average: 7.4,
        vote_count: 23569,
        runtime: 127,
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing data
        await Movie.deleteMany({});
        await Show.deleteMany({});
        console.log("Cleared existing movies and shows");

        // Insert movies
        const insertedMovies = await Movie.insertMany(dummyMovies);
        console.log(`Inserted ${insertedMovies.length} movies`);

        // Create 3 shows per movie across the next 3 days
        const shows = [];
        const prices = [49, 59, 79, 81, 99];
        const hours = [10, 14, 18, 21]; // 10AM, 2PM, 6PM, 9PM

        for (const movie of insertedMovies) {
            for (let day = 0; day < 3; day++) {
                const date = new Date();
                date.setDate(date.getDate() + day);
                const hour = hours[Math.floor(Math.random() * hours.length)];
                date.setHours(hour, 0, 0, 0);

                shows.push({
                    movie: movie._id,
                    theater: "QuickShow Cinema",
                    showDateTime: new Date(date),
                    showPrice: prices[Math.floor(Math.random() * prices.length)],
                });
            }
        }

        const insertedShows = await Show.insertMany(shows);
        console.log(`Inserted ${insertedShows.length} shows`);

        console.log("\n✅ Seed complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error.message);
        process.exit(1);
    }
};

seed();
