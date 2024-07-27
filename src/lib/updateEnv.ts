import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envFilePath = path.resolve(__dirname, '../../.env');

const updateEnv = (key: string, value: string) => {
  try {
    // Parse current .env file
    const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

    // Update specific key with new value
    envConfig[key] = value;

    // Serialize updated environment variables to string
    const updatedEnv = Object.entries(envConfig)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    // Write updated environment variables back to .env file
    fs.writeFileSync(envFilePath, updatedEnv);

    console.log(`Successfully updated ${key} in .env`);
  } catch (err) {
    console.error(`Error updating ${key} in .env:`, err);
  }
};

export default updateEnv;
