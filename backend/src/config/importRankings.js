
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const pool = require("./db");

const csvPath = path.resolve(
  __dirname,
  "../../data/unipath_qs_2026_top500.csv"
);

function toNumberOrNull(value) {
  if (value === undefined || value === null || value.trim() === "") {
    return null;
  }

  const normalized = value.trim();

  if (normalized === "-" || !Number.isFinite(Number(normalized))) {
    return null;
  }

  return Number(normalized);
}

async function importRankings() {
  let client;

  try {
    if (!fs.existsSync(csvPath)) {
      throw new Error(
        `CSV fayl topilmadi: ${csvPath}`
      );
    }

    const csvContent = fs.readFileSync(csvPath, "utf8");

    const rows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    if (rows.length === 0) {
      throw new Error("CSV fayl bo'sh.");
    }

    const requiredColumns = [
      "rank_numeric",
      "qs_rank_2026",
      "qs_rank_2025",
      "university_name",
      "country_or_territory",
      "region",
      "institution_size",
      "institution_focus",
      "research_intensity",
      "institution_status",
      "overall_score",
      "academic_reputation_score",
      "employer_reputation_score",
      "faculty_student_score",
      "citations_per_faculty_score",
      "international_faculty_score",
      "international_students_score",
      "international_students_diversity_score",
      "international_research_network_score",
      "employment_outcomes_score",
      "sustainability_score",
    ];

    for (const column of requiredColumns) {
      if (!Object.hasOwn(rows[0], column)) {
        throw new Error(
          `CSV faylda "${column}" ustuni topilmadi.`
        );
      }
    }

    client = await pool.connect();
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS university_rankings (
        id SERIAL PRIMARY KEY,
        university_name TEXT NOT NULL,
        country_or_territory TEXT NOT NULL,
        region TEXT,
        rank_2026 TEXT,
        rank_numeric INTEGER,
        rank_2025 TEXT,
        overall_score NUMERIC,
        institution_size TEXT,
        institution_focus TEXT,
        research_intensity TEXT,
        institution_status TEXT,
        academic_reputation_score NUMERIC,
        employer_reputation_score NUMERIC,
        faculty_student_score NUMERIC,
        citations_per_faculty_score NUMERIC,
        international_faculty_score NUMERIC,
        international_students_score NUMERIC,
        international_students_diversity_score NUMERIC,
        international_research_network_score NUMERIC,
        employment_outcomes_score NUMERIC,
        sustainability_score NUMERIC,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT university_rankings_unique
          UNIQUE (university_name, country_or_territory)
      );
    `);

    const insertQuery = `
      INSERT INTO university_rankings (
        university_name,
        country_or_territory,
        region,
        rank_2026,
        rank_numeric,
        rank_2025,
        overall_score,
        institution_size,
        institution_focus,
        research_intensity,
        institution_status,
        academic_reputation_score,
        employer_reputation_score,
        faculty_student_score,
        citations_per_faculty_score,
        international_faculty_score,
        international_students_score,
        international_students_diversity_score,
        international_research_network_score,
        employment_outcomes_score,
        sustainability_score
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21
      )
      ON CONFLICT (university_name, country_or_territory)
      DO UPDATE SET
        region = EXCLUDED.region,
        rank_2026 = EXCLUDED.rank_2026,
        rank_numeric = EXCLUDED.rank_numeric,
        rank_2025 = EXCLUDED.rank_2025,
        overall_score = EXCLUDED.overall_score,
        institution_size = EXCLUDED.institution_size,
        institution_focus = EXCLUDED.institution_focus,
        research_intensity = EXCLUDED.research_intensity,
        institution_status = EXCLUDED.institution_status,
        academic_reputation_score = EXCLUDED.academic_reputation_score,
        employer_reputation_score = EXCLUDED.employer_reputation_score,
        faculty_student_score = EXCLUDED.faculty_student_score,
        citations_per_faculty_score = EXCLUDED.citations_per_faculty_score,
        international_faculty_score = EXCLUDED.international_faculty_score,
        international_students_score = EXCLUDED.international_students_score,
        international_students_diversity_score =
          EXCLUDED.international_students_diversity_score,
        international_research_network_score =
          EXCLUDED.international_research_network_score,
        employment_outcomes_score = EXCLUDED.employment_outcomes_score,
        sustainability_score = EXCLUDED.sustainability_score,
        updated_at = NOW();
    `;

    let imported = 0;

    for (const row of rows) {
      const name = row.university_name?.trim();
      const country = row.country_or_territory?.trim();

      if (!name || !country) {
        throw new Error(
          `Universitet nomi yoki mamlakat bo'sh: ${JSON.stringify(row)}`
        );
      }

      const rank = toNumberOrNull(row.rank_numeric);

      if (rank === null || !Number.isInteger(rank) || rank > 500) {
        throw new Error(
          `Reyting qiymati noto'g'ri: ${name} (${row.rank_numeric})`
        );
      }

      await client.query(insertQuery, [
        name,
        country,
        row.region || null,
        row.qs_rank_2026 || null,
        rank,
        row.qs_rank_2025 || null,
        toNumberOrNull(row.overall_score),
        row.institution_size || null,
        row.institution_focus || null,
        row.research_intensity || null,
        row.institution_status || null,
        toNumberOrNull(row.academic_reputation_score),
        toNumberOrNull(row.employer_reputation_score),
        toNumberOrNull(row.faculty_student_score),
        toNumberOrNull(row.citations_per_faculty_score),
        toNumberOrNull(row.international_faculty_score),
        toNumberOrNull(row.international_students_score),
        toNumberOrNull(row.international_students_diversity_score),
        toNumberOrNull(row.international_research_network_score),
        toNumberOrNull(row.employment_outcomes_score),
        toNumberOrNull(row.sustainability_score),
      ]);

      imported++;
    }

    await client.query("COMMIT");

    const result = await client.query(`
      SELECT COUNT(*)::int AS total
      FROM university_rankings;
    `);

    console.log(`Import yakunlandi! CSV qatorlari: ${imported}`);
    console.log(
      `Bazadagi jami QS universitetlari: ${result.rows[0].total}`
    );
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    console.error("Import xatosi:", error.message);
    process.exitCode = 1;
  } finally {
    if (client) {
      client.release();
    }

    await pool.end();
  }
}

importRankings();
