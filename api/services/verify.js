require("dotenv").config()

const User = require("../model/users")
const { generateKey } = require("./generateRandomKey")
// const sendmail = require("../email/emailer").sendmail
const raise = require("./raise")
const getDate = require("./datetime").getDate

function verifyUser(uuid, confirmationCode) {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({_id:uuid})

        if(user == null) {
            if (process.env.NODE_ENV == "development")
                console.log(getDate(Date.now()), "User does not exist.")
            return reject(raise("E03", 404))
        }

        if(user.confirmationCode !== confirmationCode){
            if (process.env.NODE_ENV == "development")
                console.log(getDate(Date.now()), "Incorrect/Invalid confirmation code")
            return reject(raise("E01", 401))
        }

        try {
            user.status = "Active"
            user.save()
            resolve(null)
        } catch(err) {
            if (process.env.NODE_ENV == "development")
                    console.log(getDate(Date.now()), err.message)
                return reject("S01", 500)
        }

        let email_directory = "../email/success.html"

        let configuration = {
            from: process.env.EMAIL_ADD,
            to: user.email,
            subject: "RE: Successful Account Verification"
        }

        let replacements = {
            email: user.email,
            emailSupport: process.env.EMAIL_ADD
        }

        if(process.env.NODE_ENV == "development")
            return resolve(null)

        sendmail(configuration.from, configuration.to, configuration.subject, email_directory, replacements).catch(err => {
            if(process.env.NODE_ENV == "development")
                console.log(getDate(Data.now()), err.message)
            return reject(raise("S01", 500))
        })

        resolve(null)
    })
}

/**
 * Sends confirmation email to the newly created user
 * @param {Object} userInfo
 * @returns {Promise<null>}
 */
function sendConfirmationEmail(userInfo) {
    return new Promise(async (resolve, reject)=>{
        let email_directory = "../email/verify.html"

        let configuration = {
            from: process.env.EMAIL_ADD,
            to: userInfo.email,
            subject: "RE: Account Verification"
        }

        let replacements = {
            email: userInfo.email,
            emailSupport: process.env.EMAIL_ADD
        }

        if(process.env.NODE_ENV == "development")
            return resolve(null)

        await sendmail(configuration.from, configuration.to, configuration.subject, email_directory, replacements)
        .catch(err => {
            if (process.env.NODE_ENV == "development")
                    console.log(getDate(Date.now()), err.message)
                return reject(raise("S01", 500))
        }).then(result => resolve(null))
    })
}


/**
 * Generates a new code and resends it to user. Accepts email only.
 * @param {Object} userInfo
 * @returns {Promise<null>}
 */
function resendConfirmationEmail(userInfo) {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({ email: userInfo.email })

        if (user == null) {
            if (process.env.NODE_ENV == "development")
                console.log(getDate(Date.now()), "User does not exist.")
            return reject(raise("E05", 409))
        }

        const confirmationCode = generateKey(3)

        user.confirmationCode = confirmationCode
        
        try {
            user.confirmationCode = confirmationCode
            user.save()
            resolve(null)
        } catch(err) {
            if (process.env.NODE_ENV == "development")
                    console.log(getDate(Date.now()), err.message)
                return reject("S01", 500)
        }

        userInfo.code = confirmationCode

        sendConfirmationEmail(userInfo).catch(err => {
            if(err) {
                if(process.env.NODE_ENV == "development")
                    console.log(getDate(Date.now()), err.message)
                return reject(raise("S01", 500))
            }
        }).then(result => resolve(null))
    })
}

/**
 * Verifies access token, can be used in other routes as middleware
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {Callback}
 */
function verifyAccessToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    // Returns error if user does not have token
    if (token == null) return res.status(401).send({ err: "E01" })

    try {
        // Verifies if token is valid
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
            if (err) throw err
            req.body.uuid = result.data.uuid
            return next()
        })
    } catch (err) {
        if (process.env.NODE_ENV === "development") console.log(getDate(Date.now(), err.message))
        return res.status(403).send({ err: "E02" })
    }
}

module.exports.verifyUser = verifyUser
module.exports.sendConfirmationEmail = sendConfirmationEmail
module.exports.resendConfirmationEmail = resendConfirmationEmail
module.exports.verifyAccessToken = verifyAccessToken
