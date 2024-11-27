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

// Check if the make already exists
async function checkIfMakeExists(makeName) {
  const query = 'SELECT make_id FROM makes WHERE name = $1';
  const values = [makeName];
  try {
    const res = await pool.query(query, values);
    return res.rows.length > 0 ? res.rows[0].make_id : null; // Return make_id if exists, else null
  } catch (err) {
    console.error(`Error checking if make '${makeName}' exists:`, err.message);
    throw err;
  }
}

// Insert a make into the makes table if it doesn't already exist
async function insertMake(makeName) {
  const existingMakeId = await checkIfMakeExists(makeName);
  if (existingMakeId) {
    console.log(`Make '${makeName}' already exists with ID: ${existingMakeId}`);
    return existingMakeId; // Return the existing make_id if make already exists
  }

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

// Check if the model already exists for a specific make
async function checkIfModelExists(makeId, modelName) {
  const query = 'SELECT model_id FROM models WHERE make_id = $1 AND name = $2';
  const values = [makeId, modelName];
  try {
    const res = await pool.query(query, values);
    return res.rows.length > 0 ? res.rows[0].model_id : null; // Return model_id if exists, else null
  } catch (err) {
    console.error(`Error checking if model '${modelName}' exists for make_id ${makeId}:`, err.message);
    throw err;
  }
}

// Insert a model into the models table if it doesn't already exist
async function insertModel(makeId, modelName) {
  const existingModelId = await checkIfModelExists(makeId, modelName);
  if (existingModelId) {
    console.log(`Model '${modelName}' already exists for make ID ${makeId}`);
    return; // Skip inserting the model if it already exists
  }

  const query = `INSERT INTO models (make_id, name) VALUES ($1, $2)`;
  const values = [makeId, modelName];
  try {
    await pool.query(query, values);
    console.log(`  Inserted model: ${modelName} for make: ${makeId}`);
  } catch (err) {
    console.error(`Error inserting model '${modelName}' for make_id ${makeId}:`, err.message);
    throw err;
  }
}

// Fetch all makes from the makes table
async function fetchAllMakes() {
  const query = 'SELECT name FROM makes ORDER BY name ASC';
  try {
    const res = await pool.query(query);
    return res.rows.map(row => row.name); // Return an array of make names
  } catch (err) {
    console.error('Error fetching makes:', err.message);
    throw err;
  }
}

// Main function to populate makes and models
async function populateMakesAndModels() {
  try {
    // Fetch all makes from the makes table
    const makes = await fetchAllMakes();

    for (const makeName of makes) {
      // Insert the make and get its ID
      const makeId = await insertMake(makeName);
      console.log(`Inserted or found existing make: ${makeName} (ID: ${makeId})`);

      // Find the corresponding models JSON file
      const makeName_file = makeName.replace(/ /g, '_');
      const modelsFile = path.join(__dirname, `${makeName_file}.json`);
      if (fs.existsSync(modelsFile)) {
        // Read and parse the models JSON file
        const models = JSON.parse(fs.readFileSync(modelsFile, 'utf-8'));

        for (const modelName of models) {
          // Insert each model
          await insertModel(makeId, modelName);
        }
      } else {
        throw new Error(`Models file not found for make: ${makeName}`);
      }
    }
  } catch (err) {
    console.log('Error populating makes and models:', err.message);
  } finally {
    // Close the database connection
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run the script
populateMakesAndModels();
