import CreateProperty from "../models/property.model.js";

export const createProperty = async (req, res) => {
  try {
    const property = await CreateProperty.create(req.body);

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create property",
      error: error.message,
    });
  }
};
