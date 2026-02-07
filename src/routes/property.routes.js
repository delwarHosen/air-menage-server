import express from "express";
import { createProperty } from "../controllers/property.controller.js";

const propertyRoutes = express.Router();

propertyRoutes.post("/", createProperty);

export default propertyRoutes;
