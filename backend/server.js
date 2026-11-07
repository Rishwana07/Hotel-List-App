const hotelRoutes = require("./routes/hotelRoutes");
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/hotels", hotelRoutes);

// Test API
app.get("/", (req, res) => {
    res.send("Hotel Management Backend is Running!");
});

// Test PostgreSQL connection
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "PostgreSQL Connected Successfully!",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Database Connection Failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});