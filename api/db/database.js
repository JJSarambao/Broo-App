const mongoose = require("mongoose")
const getDate = require("../services/datetime").getDate

async function connectDb(DATABASE_URL, DB_OPTIONS) {
    await mongoose.connect(DATABASE_URL, DB_OPTIONS)
    console.log(getDate(Date.now()), "Connected to the database.")
}

module.exports.connectDb = connectDb