import swaggerJSDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const porta = process.env.PORT || 3000;

const options: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API PosTech fase 2",
            version: "1.0.0",
            description: "Documentação da API PosTech fase 2",
        }
    },
    apis: ["./src/routes/*.ts"],
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
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;