const { truncate } = require("fs/promises")
const mongoose = require("mongoose")

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Active"],
        default: "Pending"
    },
    confirmationCode: {
        type: String,
        unique: true,
        default: null
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "Admin"
    }
}, { timestamps: true })

// Create a model from the schema
const User = mongoose.model("user", userSchema)

// Exports
module.exports = User