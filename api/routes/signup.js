const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")
const verifier = require("../services/verify")
const authenticator = require("../services/auth")

const createUser = require("../controller/userControl").createUser

router.get('/', (req, res) => {
    return res.sendStatus(200)
})

router.post('/v1', async (req, res) => {
    try {
        let userInfo = {
            password: req.query.password,
            userName: req.query.username
        }
        const {uuid, code} = await createUser(userInfo)

        userInfo.uuid = uuid
        userInfo.code = code.toLowerCase()

        await verifier.sendConfirmationEmail(userInfo)
        console.log(code)
        return res.status(200).send({text:"Signup Complete", uuid:userInfo.uuid, code:userInfo.code})
    }
    catch (err) {
        return res.status(err.code || 500).send({err:err.message})
    }
})

router.get("/v1/verify/:uuid/:confirmationCode", async (req, res) => {
    try {
        console.log(req.params.uuid)
        console.log(req.params.confirmationCode )
        await verifier.verifyUser(req.params.uuid, req.params.confirmationCode)

        const data = {
            checker: "test_checker",
            uuid: req.params.uuid
        }

        const token = authenticator.generateAccessToken(data)
        return res.status(200).send({accesstoken: token})
    }
    catch (err) {
        return res.status(err.code || 500).send({err: err.message})
    }
})

module.exports = router