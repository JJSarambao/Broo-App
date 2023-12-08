const encryptor = require("bcrypt")
const {default: mongoose} = require("mongoose")
const userdb = require("../model/users")
const getDate = require("../services/datetime").getDate
const raise = require("../services/raise")
const {generateKey} = require("../services/generateRandomKey")


/**
 * Creates a new user and store it in the database.
 * @param {Object} userInfo
 * @returns {Promise<{ uuid : string, code : string }>}
 */

function createUser(userInfo) {
    return new Promise(async (resolve, reject) => {
        // Check if the user already exist
        const user = await userdb.findOne({ username: userInfo.username }, "email")
        if (user != null) return reject(raise("E05", 409))

        // Validate password
        const validate = function (v) {
            let regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,24}$/g
            return regex.test(v)
        }

        if (validate(userInfo.password) === false) return reject(raise("E05", 409))

        // Encrypt password
        const salt = await encryptor.genSalt()
        const hashedPassword = await encryptor.hash(userInfo.password, salt)

        const confirmationCode = generateKey(5)

        // Create the user
        let _userId
        await userdb.create({
            password: hashedPassword,
            username: userInfo.userName,
            confirmationCode: confirmationCode
        }).then((user) => {
            _userId = user._id
            if (process.env.NODE_ENV === "development")
                console.log(getDate(Date.now()), `Adding ${userInfo.username} to the database...`)
            return resolve({uuid: _userId, code: confirmationCode})
        }).catch((err) => reject(raise("S01", 500)))


    })
}

/**
 * Finds a user from the database using uuid
 * @param {string} uuid
 * @returns {Promise<mongoose.Document<User>>}
 */
function getUserByUUID(uuid) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await userdb.findById(uuid)
            if (user == null) return resolve(null)
            return resolve(user)
        } catch (err) {
            if (process.env.NODE_ENV === "development")
                console.log(getDate(Date.now()), err.message)
            return reject(raise("S01", 500))
        }
    })
}

/**
 * Deletes a user from the database using uuid
 * @param {string} uuid 
 * @returns {Promise<null>}
 */
function deleteUser(uuid) {
    return new Promise((resolve, reject) => {
        try {
            userdb.deleteOne({ id: uuid })
            return resolve(null)
        } catch (err) {
            if (process.env.NODE_ENV === "development")
                console.log(getDate(Date.now()), err.message)
            return reject(raise("S01", 500))
        }
    })
}

/**
 * Finds a user from the database using email
 * @param {string} email 
 * @returns {Promise<mongoose.Document<User>>}
 */
function getUserByUsername(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await userdb.findOne({ username: email })
            if (user == null) return resolve(null)
            return resolve(user)
        } catch (err) {
            if (process.env.NODE_ENV === "development")
                console.log(getDate(Date.now()), err.message)
            return reject(raise("S01", 500))
        }
    })
}

// Exports
module.exports.createUser = createUser
module.exports.getUserByUsername = getUserByUsername
module.exports.getUserByUUID = getUserByUUID
module.exports.deleteUser = deleteUser