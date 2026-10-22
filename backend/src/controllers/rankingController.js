
const pool = require("../config/db");

const getRankings = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const country = (req.query.country || "").trim();

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 20)
    );
    const offset = (page - 1) * limit;

    const conditions = [];
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      conditions.push(
        `(university_name ILIKE $${values.length}
          OR country_or_territory ILIKE $${values.length})`
      );
    }

    if (country) {
      values.push(country);
      conditions.push(`country_or_territory ILIKE $${values.length}`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM university_rankings
       ${whereClause}`,
      values
    );

    const total = countResult.rows[0].total;

    const dataValues = [...values, limit, offset];

    const result = await pool.query(
      `SELECT
         id,
         university_name,
         country_or_territory,
         region,
         rank_2026,
         rank_numeric,
         rank_2025,
         overall_score
       FROM university_rankings
       ${whereClause}
       ORDER BY rank_numeric ASC, university_name ASC
       LIMIT $${values.length + 1}
       OFFSET $${values.length + 2}`,
      dataValues
    );

    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: result.rows,
    });
  } catch (error) {
    console.error("Get rankings error:", error);

    res.status(500).json({
      success: false,
      message: "Universitet reytinglarini olishda xatolik yuz berdi.",
    });
  }
};

module.exports = { getRankings };
