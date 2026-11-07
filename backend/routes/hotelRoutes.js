
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const multer = require("multer");
const path = require("path");

// Image storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads"));
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Image upload validation
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG and WEBP images are allowed"));
        }
    }
});

// GET - Fetch hotels with Search, Price Filter and Pagination
router.get("/", async (req, res) => {
    try {
        const {
            search = "",
            minPrice,
            maxPrice,
            page = 1,
            limit = 3
        } = req.query;

        const currentPage = Math.max(1, parseInt(page) || 1);
        const pageLimit = Math.max(1, parseInt(limit) || 3);
        const offset = (currentPage - 1) * pageLimit;

        let conditions = [];
        let values = [];

        if (search.trim()) {
            values.push(`%${search.trim()}%`);
            conditions.push(`title ILIKE $${values.length}`);
        }

        if (minPrice !== undefined && minPrice !== "") {
            values.push(Number(minPrice));
            conditions.push(`price >= $${values.length}`);
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            values.push(Number(maxPrice));
            conditions.push(`price <= $${values.length}`);
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM hotels ${whereClause}`,
            values
        );

        const totalHotels = Number(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT * FROM hotels
             ${whereClause}
             ORDER BY id ASC
             LIMIT $${values.length + 1}
             OFFSET $${values.length + 2}`,
            [...values, pageLimit, offset]
        );

        res.status(200).json({
            hotels: result.rows,
            pagination: {
                totalHotels,
                currentPage,
                totalPages: Math.ceil(totalHotels / pageLimit),
                limit: pageLimit
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching hotels"
        });
    }
});

// POST - Add new hotel
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const {
            title,
            description,
            latitude,
            longitude,
            price
        } = req.body;

        if (
            !title ||
            !title.trim() ||
            price === undefined ||
            price === "" ||
            !Number.isFinite(Number(price)) ||
            Number(price) <= 0
        ) {
            return res.status(400).json({
                message: "Valid title and positive price are required"
            });
        }

        const image = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const result = await pool.query(
            `INSERT INTO hotels
            (image, title, description, latitude, longitude, price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                image,
                title.trim(),
                description || null,
                latitude || null,
                longitude || null,
                Number(price)
            ]
        );

        res.status(201).json({
            message: "Hotel added successfully",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error adding hotel"
        });
    }
});

// PUT - Update hotel
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            latitude,
            longitude,
            price
        } = req.body;

        if (
            !title ||
            !title.trim() ||
            price === undefined ||
            price === "" ||
            !Number.isFinite(Number(price)) ||
            Number(price) <= 0
        ) {
            return res.status(400).json({
                message: "Valid title and positive price are required"
            });
        }

        const existingHotel = await pool.query(
            "SELECT * FROM hotels WHERE id = $1",
            [id]
        );

        if (existingHotel.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        const oldHotel = existingHotel.rows[0];

        const image = req.file
            ? `/uploads/${req.file.filename}`
            : oldHotel.image;

        const result = await pool.query(
            `UPDATE hotels
             SET image = $1,
                 title = $2,
                 description = $3,
                 latitude = $4,
                 longitude = $5,
                 price = $6
             WHERE id = $7
             RETURNING *`,
            [
                image,
                title.trim(),
                description || null,
                latitude || null,
                longitude || null,
                Number(price),
                id
            ]
        );

        res.status(200).json({
            message: "Hotel updated successfully",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating hotel"
        });
    }
});

// DELETE - Delete hotel
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM hotels WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        res.status(200).json({
            message: "Hotel deleted successfully",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error deleting hotel"
        });
    }
});

module.exports = router;
