require("dotenv").config()

const auth = require("../services/auth")
const express = require("express")
const router = express.Router()

router.get('/', auth.verifyAccessToken, (req, res) => {
    return res.sendStatus(200)
})

router.post('/', async (req, res) => {
    try {
        const userInfo = {
            username: req.body.username,
            password: req.body.password
        }

        const { refreshToken, accessToken } = await auth.requestRefreshToken(userInfo)
        return res.status(200).send({
            refreshToken: refreshToken,
            accessToken: accessToken
        })
    }
    catch (err) {
        return res.status(err.code).send({ err: err.message })
    }
})

// Refreshes access token by passing in the refresh token to the POST
router.post('/token', async (req, res) => {
    try {
        const accessToken = await auth.requestAccessToken(req.body.refreshToken)
        return res.status(200).send({ accessToken })
    }
    catch (err) {
        return res.status(err.code).send({ err: err.message })
    }
})

module.exports = router