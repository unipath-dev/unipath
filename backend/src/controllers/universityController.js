
const pool = require("../config/db");

async function getUniversities(req, res) {
  try {
    const {
      search,
      program,
      state,
      maxTuition,
      minScholarship,
    } = req.query;

    const conditions = [];
    const values = [];

    // Search by university name, city, state, or program
    if (search?.trim()) {
      values.push(search.trim());
      const parameter = `$${values.length}`;

      conditions.push(`(
        name ILIKE '%' || ${parameter} || '%'
        OR city ILIKE '%' || ${parameter} || '%'
        OR state ILIKE '%' || ${parameter} || '%'
        OR program ILIKE '%' || ${parameter} || '%'
      )`);
    }

    // Filter by academic program
    if (program?.trim()) {
      values.push(program.trim());
      const parameter = `$${values.length}`;

      conditions.push(
        `program ILIKE '%' || ${parameter} || '%'`
      );
    }

    // Filter by state
    if (state?.trim()) {
      values.push(state.trim());
      const parameter = `$${values.length}`;

      conditions.push(
        `state ILIKE '%' || ${parameter} || '%'`
      );
    }

    // Filter by maximum annual tuition
    if (maxTuition !== undefined && maxTuition !== "") {
      const amount = Number(maxTuition);

      if (!Number.isFinite(amount) || amount < 0) {
        return res.status(400).json({
          success: false,
          message: "maxTuition must be a non-negative number",
        });
      }

      values.push(amount);
      conditions.push(
        `annual_tuition <= $${values.length}`
      );
    }

    // Filter by minimum scholarship amount
    if (
      minScholarship !== undefined &&
      minScholarship !== ""
    ) {
      const amount = Number(minScholarship);

      if (!Number.isFinite(amount) || amount < 0) {
        return res.status(400).json({
          success: false,
          message:
            "minScholarship must be a non-negative number",
        });
      }

      values.push(amount);
      conditions.push(
        `scholarship_amount >= $${values.length}`
      );
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
      SELECT
        id,
        name,
        city,
        state,
        country,
        program,
        annual_tuition,
        scholarship_amount,
        official_url
      FROM universities
      ${whereClause}
      ORDER BY name ASC
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "Error fetching universities:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch universities",
    });
  }
}

module.exports = {
  getUniversities,
};
