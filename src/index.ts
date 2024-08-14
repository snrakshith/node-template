import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import passport from "passport";

import mongoDB from "./shared/integrations/mongoDB";
import { corsOptions } from "./shared/utils/corsOptions";
import apiSpec from "./openapi.yaml";

// Routes

dotenv.config({
  path: path.resolve(`./src/shared/environments/.env.${process.env.NODE_ENV}`),
});

mongoose.set("strictQuery", false);

const app = express();

// Accept Json to parse
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

const API_VERSION = 1;
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.set("trust proxy", 1);

app.use(passport.initialize());

// Tell passport to use this strategy

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Run mongoDB setup
mongoDB();

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(apiSpec));

// OpenAPI Json
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(apiSpec);
});

// Auth Routes
// app.use("/auth", authRouter);

// Web API
// app.use(`/v${API_VERSION}/site`, siteRouter);

// Mobile API
// app.use(`/v${API_VERSION}/studio`, studioRouter);

// Shared API
// app.use(`/v${API_VERSION}/platform`, platformRouter);

// The "z" at the end of /readyz and /livez are a pattern called "z pages"
app.get("/readyz", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/livez", (req, res) => res.status(200).json({ status: "ok" }));

app.use(async (req, res, next) => {
  next(res.status(404).json({ message: "Route not found" }));
});

// Catch all route if no route matches
app.use((err: any, res: any) => {
  res.status(err.status || 500).json({
    status: false,
    message: err.message,
  });
});

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
