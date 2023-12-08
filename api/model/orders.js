const mongoose = require("mongoose")

const customerInfoSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
})

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        unique: true,
        default: 0
    },
    orders:[{
        itemId: {
            type: String,
            required: true,
            unique: false
        },
        itemSize: {
            type: String,
            required: true,
            unique: false
        },
        itemQuantity: {
            type: Number,
            default: 0,
            unique: false
        }
    }],
    customerInfo: {
        type: customerInfoSchema
    },
    price: {
        type: Number,
        required: true
    }

}, { timestamps: true })

const Orders = mongoose.model("Orders", orderSchema)
module.exports = Orders