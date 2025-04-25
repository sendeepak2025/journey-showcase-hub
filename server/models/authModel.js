const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },
        role: { 
            type: String, 
            default: "user" }


    },
    { timestamps: true }
);

module.exports = mongoose.model("auth", authSchema);
