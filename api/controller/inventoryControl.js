/*
TO DO
C - Create Inventory Data
    - Create New Item
R - Read Inventory Data
    - Get Stock Information
U - Update Inventory Data
    - Update Stock Information
D - Delete Inventory Data
    - Delete Item from Menu
*/
const {default: mongoose} = require("mongoose")
const Inventory = require("../model/inv")
const raise = require("../services/raise")
const { getDate } = require("../services/datetime")
require("dotenv").config()


/**
 * Creates a new item and store it in the database.
 * @param {Object} itemInfo
 * @returns {Promise<{ itemId: string }>}
 */
function addItem(itemInfo) {
    return new Promise(async (resolve, reject) => {
        const item = await Inventory.findOne({ itemId: itemInfo.itemId })
        if (item != null) {
            await Inventory.updateOne({itemId: itemInfo.itemId},
                {
                    itemStock: item.itemStock + itemInfo.itemQuantity
                }).then((itemCallback) => {
                    if (process.env.NODE_ENV === "development")
                        console.log(getDate(Date.now()), `Updating ${item.itemName} on the database...`)
                    return resolve({itemId: itemInfo.itemId, itemQuantity: item.itemStock + itemInfo.itemQuantity})
                }).catch((err) => {return reject(raise("S01", 500))})
        } else {
                const _itemId = itemInfo.itemName.replaceAll(" ", "_") + "_" + Math.floor(Math.random()*100)
                await Inventory.create({
                    itemId: _itemId,
                    itemName: itemInfo.itemName,
                    itemStock: itemInfo.itemQuantity
                }).then((itemCallback) => {
                    if (process.env.NODE_ENV === "development")
                        console.log(getDate(Date.now()), `Adding ${itemInfo.itemName} to the database...`)
                    return resolve({itemId: _itemId, itemQuantity: itemInfo.itemQuantity})
                }).catch((err) => reject(raise("S01", 500)))
        }
    })
}

/**
 * Gets the whole Item Database for Menu viewing
 * @param {Object} itemInfo
 * @returns {Promise<[itemlist]>}
 */
function getMenu() {
    return new Promise(async (resolve, reject) => {
        try {
            const menu = await Inventory.find()
            if (menu == null) return resolve(null)
            return resolve({itemList: menu})
        } catch (err) {
            if (process.env.NODE_ENV === "development")
                console.log(getDate(Date.now()), err.message)
            return reject(raise("S01", 500))
        }
    })
}

/**
 * Updates an item and stores it in the database.
 * @param {Object} itemInfo
 * @returns {Promise<{ result: int }>}
 */
function checkItem(itemInfo) {
    console.log(itemInfo)
    return new Promise(async (resolve, reject) => {
        const item = await Inventory.findOne({itemName: itemInfo.itemName})
        if (item == null) return resolve({result: 0})
        else return resolve({result: 1})
    })
}

/**
 * Deletes an Item from the database
 * @param {Object} itemInfo
 * @returns {Promise<null>}
 */
function deleteItem(itemInfo) {
    return new Promise(async (resolve, reject) => {
        const item = await Inventory.findOne({itemId: itemInfo.itemId})
        if (item == null) return reject(raise("E05", 404))

        await Inventory.deleteOne({
            itemId:itemInfo.itemId
        }).then((itemCallback) => {
            if (process.env.NODE_ENV === "development")
                console.log(getDate(Date.now()), `Successfully deleted ${itemInfo.itemId} from database.`)
            return resolve(null)
        }).catch((err) => reject(raise("S01", 500)))
    })
}

module.exports.addItem = addItem
module.exports.getMenu = getMenu
module.exports.checkItem = checkItem
module.exports.deleteItem = deleteItem