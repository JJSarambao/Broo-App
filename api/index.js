const express = require("express")
const getDate = require("./services/datetime").getDate
const morgan = require("morgan")
const cors = require("cors")
const db = require("./db/database")
const DATABASE_URL = "mongodb://127.0.0.1:27017/test_db"
const DB_OPTIONS = {}

const server = express()
server.use(express.json())
server.use(morgan("dev"))
server.use(cors())
const PORT = 8080



db.connectDb(DATABASE_URL, DB_OPTIONS)
    .then((result) => {
        // Listen to port
        server.listen(PORT, console.log(getDate(Date.now()), `Auth. server listening to port ${PORT}...`))

    })
    .catch((reason) => {
        console.log(getDate(Date.now(), `Failed to connect to db: ${reason}`))
    })

const test_route = require("./routes/test")
const signup = require("./routes/signup")
const login = require("./routes/login")
const order = require("./routes/order")
const Inventory = require("./routes/inventory")
server.use("/test", test_route)
server.use("/signup", signup)
server.use("/login", login)
server.use("/orders", order)
server.use("/inventory", Inventory)

server.all("*", (req, res) => {
    res.sendStatus(404)
})