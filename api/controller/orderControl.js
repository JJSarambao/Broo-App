const {default: mongoose} = require("mongoose")
const Orders = require("../model/orders")
const raise = require("../services/raise")
const getDate = require("../services/datetime").getDate


function addOrder(orderInfo) {
    return new Promise(async (resolve, reject) => {
        let _orderId
        const orderIndexChecker = await Orders.find().sort({$natural:-1}).limit(1)
        if (orderIndexChecker.length === 0)
            _orderId = 0
        else
            _orderId = orderIndexChecker[0].orderId + 1
        await Orders.create({
            orderId: _orderId,
            orders: orderInfo.orders,
            customerInfo: {
                Name: orderInfo.customerInfo.Name,
                gender: orderInfo.customerInfo.gender,
                age: orderInfo.customerInfo.age
            },
            price: orderInfo.price
        }).then((orderCallback) => {
            _orderId = orderCallback.orderId
            if (process.env.NODE_ENV === "development")
                console.log(getDate(Date.now()), `Successfully added ${_orderId} to database`)
            return resolve({orderId: _orderId})
        }).catch((err) => {
            reject(raise("S01", 500))
        })
    })

}

function viewOrder(orderInfo) {
    return new Promise(async (resolve, reject) => {
        if (orderInfo.orderId == -1){
            const orderCheck = await Orders.find()
            return resolve({orderList: orderCheck})
        }
        const orderCheck = await Orders.findOne({orderId: orderInfo.orderId})
        if (orderCheck == null) return reject(raise("E05", 404))
        return resolve(orderCheck)
    })

}

function deleteOrder(orderInfo) {
    return new Promise(async (resolve, reject) => {
        const orderCheck = await Orders.findOne({orderId: orderInfo.orderId})
        if (orderCheck == null) return reject(raise("E05", 404))
        await Orders.deleteOne({
            orderId: orderInfo.orderId
        }).then((orderCallback) => {
            if (process.env.NODE_ENV === "development")
                console.log(getDate(Date.now()), `Successfully deleted ${orderCheck._id} from database`)
            return resolve()
        }).catch((err) => reject(raise("S01", 500)))
    })
}

function getTotal() {
    return new Promise(async (resolve, reject) => {
        try {
            const totalSales = await Orders.aggregate([{$group:{_id: null,totalSales: { $sum: "$price" }}}])
            return resolve({profit: totalSales[0].totalSales})
        } catch (err) {
            reject(raise("S01", 500))
        }
    })
}

module.exports.addOrder = addOrder
module.exports.viewOrder = viewOrder
module.exports.deleteOrder = deleteOrder
module.exports.getTotal = getTotal
