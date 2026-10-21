
const pool = require("./db");

const universities = [
  {
    name: "University of Oklahoma",
    city: "Norman",
    state: "Oklahoma",
    program: "Computer Science",
    tuition: 34335,
    scholarship: 17500,
    url: "https://www.ou.edu/",
  },
  {
    name: "University of Alabama",
    city: "Tuscaloosa",
    state: "Alabama",
    program: "Computer Science",
    tuition: 33000,
    scholarship: 15000,
    url: "https://www.ua.edu/",
  },
  {
    name: "Iowa State University",
    city: "Ames",
    state: "Iowa",
    program: "Software Engineering",
    tuition: 30000,
    scholarship: 12000,
    url: "https://www.iastate.edu/",
  },
];

async function seedDatabase() {
  try {
    for (const university of universities) {
      await pool.query(
        `INSERT INTO universities
          (name, city, state, country, program, annual_tuition,
           scholarship_amount, official_url)
         VALUES ($1, $2, $3, 'United States', $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [
          university.name,
          university.city,
          university.state,
          university.program,
          university.tuition,
          university.scholarship,
          university.url,
        ]
      );
    }

    console.log("Sample universities inserted successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedDatabase();
