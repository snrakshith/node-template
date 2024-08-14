/* eslint-disable @typescript-eslint/ban-ts-comment */

import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(`./src/shared/environments/.env.${process.env.NODE_ENV}`),
});

const mongoOptions = {
  dbName: process.env.DB_NAME,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, mongoOptions);
    console.log("Connected to MongoDB..");
  } catch (err) {
    console.log("Could not connect to MongoDB...", err);
  }
};

mongoose.connection.on("connected", () => {
  console.log(`Mongoose is connected to DB`);
});

mongoose.connection.on("error", (error) => {
  console.log(error.message);
});

mongoose.connection.on("disconnected", () => {
  console.log(`Mongoose is disconneected to DB`);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default mongoDB;
