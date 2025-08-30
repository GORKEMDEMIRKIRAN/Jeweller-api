


import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const appRoot = __dirname;


export const config = {
    port: process.env.PORT || 3000  
};
