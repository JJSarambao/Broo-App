const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")
const { checkItem, getMenu, addItem, deleteItem } = require("../controller/inventoryControl")

router.get('/', (req, res) => {
    return res.sendStatus(200)
})

router.post('/v1/add', async(req, res) => {
    try{
        let itemInfo = {
            itemId: req.body.itemId || -1,
            itemName: req.body.itemName,
            itemQuantity: parseInt(req.body.itemQuantity)
        }
        const {itemId, itemQuantity} = await addItem(itemInfo)
        console.log(itemId)
        return res.status(200).send({text:`Successfully added and updated ${itemInfo.itemName} to the database`, stock: itemQuantity})
    } catch (err) {
        return res.status(err.code || 500).send({err:err.message})
    }
})

router.get('/v1/view', async(req, res) => {
    try{
        const {itemList} = await getMenu()
        return res.status(200).send({itemList})
    } catch (err) {
        return res.status(err.code || 500).send({err:err.message})
    }
})

router.post('/v1/vibecheck', async(req, res) => {
    try{
        let itemInfo = {
            itemName: req.body.itemName
        }
        const {result} = await checkItem(itemInfo)
        return res.status(200).send({result})
    } catch (err) {
        return res.status(err.code || 500).send({err:err.message})
    }
})

router.delete('/v1/remove', async(req, res) => {
    try{
        let itemInfo = {
            itemId: req.body.itemId
        }
        await deleteItem(itemInfo)
        res.sendStatus(200)
    } catch (err) {
        return res.status(err.code || 500).send({err:err.message})
    }
})

module.exports = router