import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerOptions";
import { corsOptions } from "./corsOptions";

const port = 4000;
const app = express();
const specs = swaggerJsDoc(swaggerOptions);

app.get("/api/docs/healthcheck", (req: Request, res: Response) => {
  res.json({ status: 200, message: "Fine!!" });
});

app.get("/api/docs/test", (req: Request, res: Response) => {
  res.json({ status: 200, message: "Running Successfully" });
});

app.get("/api/docs/kargo", (req: Request, res: Response) => {
  res.json({ status: 200, message: "Ran" });
});

app.use(express.json());

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(specs));

// OpenAPI Json
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

app.listen(port, () => console.log(`listening on ${port}`));
