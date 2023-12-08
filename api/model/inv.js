const mongoose = require("mongoose")

const inventorySchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        unique: true
    },
    itemName: {
        type: String,
        required: true,
        unique: true
    },
    itemStock: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Inventory = mongoose.model("Inventory", inventorySchema)

module.exports = Inventory