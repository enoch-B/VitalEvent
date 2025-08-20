// routes/institutions.js
const express = require("express");
const db = require("../db/knex");

const router = express.Router();

// Get all institutions
router.get("/", async (req, res) => {
  try {
    const institutions = await db("institutions").select("*");
    res.json(institutions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch institutions" });
  }
});

// Create new institution
router.post("/", async (req, res) => {
  try {
    const [id] = await db("institutions").insert(req.body).returning("id");
    const institution = await db("institutions").where({ id }).first();
    res.status(201).json(institution);
  } catch (err) {
    res.status(500).json({ error: "Failed to create institution" });
  }
});

module.exports = router;
