import swaggerJSDoc from "swagger-jsdoc";


import { readFileSync } from "fs";
import { load as loadYaml } from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";


// __dirname ESM uyumlu almak için:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Jeweller API",
      version: "1.0.0",
      description: "API documentation for Jeweller",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // JSDoc yorumları için
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// openapi.yaml'dan sadece components.schemas kısmını oku
const yamlPath = path.join(__dirname, "../../openapi.yaml");
const yamlDoc = loadYaml(readFileSync(yamlPath, "utf8")) as any;
const yamlSchemas = yamlDoc.components?.schemas || {};

// swaggerSpec'in components.schemas'ını birleştir
(swaggerSpec as any).components = ((swaggerSpec as any).components || {});
(swaggerSpec as any).components.schemas = {
  ...(((swaggerSpec as any).components && (swaggerSpec as any).components.schemas) || {}),
  ...yamlSchemas,
};

export { swaggerSpec };