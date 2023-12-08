const express = require("express")
const router = express.Router()
const { addOrder, viewOrder, deleteOrder, getTotal } = require("../controller/orderControl");


router.get('/', (req, res) => {
    return res.sendStatus(200)
})

router.post('/v1/add', async(req, res) => {
    console.log(req)
    try{
        let orders = []
        for(let i = 0; i < req.body.orders.length; i++){
            orders.push({
                itemId: req.body.orders[i].itemId,
                itemSize: req.body.orders[i].itemSize,
                itemQuantity: req.body.orders[i].itemQuantity
            })
        }
        let orderInfo = {
            orders: orders,
            customerInfo: {
                Name: req.body.Name,
                gender: req.body.gender,
                age: req.body.age
            },
            price: req.body.price
        }
        const {orderId} = await addOrder(orderInfo)

        console.log(orderId)
        return res.status(200).send({text: "Order Processed", orderId: orderId})
    } catch (err) {
        return res.status(err.code || 500).send({err:err.message})
    }
})

router.get('/v1/view', async(req, res) => {
    try{
        let orderInfo = {
            orderId: req.body.orderId || -1
        }
        const { orderList } = await viewOrder(orderInfo)
        res.status(200).send({orderList})
    } catch (err) {
        return res.status(err.code || 500).send({err:err.message})
    }
})

router.delete('/v1/void', async(req, res) => {
    try {
        let orderInfo = {
            orderId: req.body.orderId
        }
        await deleteOrder(orderInfo)
        res.sendStatus(200)
    } catch (err) {
        return res.status(err.code || 500).send({err:err.message})
    }
})

router.get('/v1/total', async(req, res) => {
    try {
        const { profit } = await getTotal()  
        res.status(200).send({total: profit})
    } catch (err) {
        return res.status(err.code || 500).send({err:err.message})
    }
})

module.exports = router