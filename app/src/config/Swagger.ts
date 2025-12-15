import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8"));

export default swaggerDocument;
