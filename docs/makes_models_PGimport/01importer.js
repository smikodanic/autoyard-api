const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection setup
const pool = new Pool({
  host: '38.242.251.114',
  database: 'autoyard',
  port: 5432,
  user: 'carfinder',
  password: '12345',
});

// Insert a make into the makes table
async function insertMake(makeName) {
  const query = `INSERT INTO makes (name) VALUES ($1) RETURNING make_id`;
  const values = [makeName];
  try {
    const res = await pool.query(query, values);
    return res.rows[0].make_id; // Return the generated make_id
  } catch (err) {
    console.error(`Error inserting make '${makeName}':`, err.message);
    throw err;
  }
}

// Insert a model into the models table
async function insertModel(makeId, modelName) {
  const query = `INSERT INTO models (make_id, name) VALUES ($1, $2)`;
  const values = [makeId, modelName];
  try {
    await pool.query(query, values);
  } catch (err) {
    console.error(`Error inserting model '${modelName}' for make_id ${makeId}:`, err.message);
    throw err;
  }
}

// Main function to populate makes and models
async function populateMakesAndModels() {
  try {
    // Read the makes JSON file
    const makesFile = path.join(__dirname, '02car_makes.json');
    const makes = JSON.parse(fs.readFileSync(makesFile, 'utf-8'));

    for (const makeName of makes) {
      // Insert the make and get its ID
      const makeId = await insertMake(makeName);
      console.log(`Inserted make: ${makeName} (ID: ${makeId})`);

      // Find the corresponding models JSON file
      const makeName_file = makeName.replace(/ /g, '_');
      const modelsFile = path.join(__dirname, `${makeName_file}.json`);
      if (fs.existsSync(modelsFile)) {
        // Read and parse the models JSON file
        const models = JSON.parse(fs.readFileSync(modelsFile, 'utf-8'));

        for (const modelName of models) {
          // Insert each model
          await insertModel(makeId, modelName);
          console.log(`  Inserted model: ${modelName} for make: ${makeName}`);
        }
      } else {
        console.log(`Models file not found for make: ${makeName}`);
      }
    }
  } catch (err) {
    console.error('Error populating makes and models:', err.message);
  } finally {
    // Close the database connection
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run the script
populateMakesAndModels();
