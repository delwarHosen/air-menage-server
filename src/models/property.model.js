import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
    {
        id: String,
        text: String,
    },
    { _id: false }
);

const propertySchema = new mongoose.Schema(
    {
        propertyTitle: String,
        propertyImage: String,

        floorNumber: String,
        apartmentNumber: String,
        propertySize: String,
        location: String,

        propertyType: {
            type: String,
            enum: ["Apartment", "House"],
            default: "Apartment",
        },

        hasElevator: {
            type: String,
            enum: ["Yes", "No"],
            default: "Yes",
        },

        keyLocation: String,
        keyPassword: String,

        bedrooms: Number,
        kitchens: Number,
        bathrooms: Number,

        description: String,
        providedService: String,

        generalWork: [workSchema],
        bedroomWork: [workSchema],
        bathroomWork: [workSchema],
        kitchenWork: [workSchema],
    },
    { timestamps: true }
);

export default mongoose.model("CreateProperty", propertySchema);
