import User from '../model/userModel.js'
import cryto from 'crypto-js'
import jwt from "jsonwebtoken";

export const SignUp = async (req, res) => {
    const { username, email, password } = req.body;

    // crypto.getHashes() you get all 'hash alogo' lik AES,SHA224,etc
    const encryptedPassword = cryto.AES.encrypt(password, process.env.bcrypt_Key).toString()

    try {
        await User.create({
            username,
            email,
            password: encryptedPassword
        })

        res.status(201).json({ message: "SignUp SuccessFully" })
    } catch (error) {
        if (error?.errorResponse?.keyValue?.username) {
            res.status(409).json({ error: "Try Different Username" })
        }
        else if (error?.errorResponse?.keyValue?.email) {
            res.status(409).json({ error: "Try Different Email" })
        }
    }
}

export const SignIn = async (req, res) => {

    try {
        const { email, password } = req.body;

        const validUser = await User.findOne({ email })
        if (!validUser) return res.status(404).json({ error: "Email not Found" })

        const decryptedPassword = cryto.AES.decrypt(validUser.password, process.env.bcrypt_Key).toString(cryto.enc.Utf8)
        if (password != decryptedPassword) return res.status(404).json({ error: "Password not Found" })

        const accessToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "1m" })
        const refreshToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "2m" })

        res.cookie('accessToken', accessToken, { maxAge: 60000 })
        res.cookie('refreshToken', refreshToken, { maxAge: 120000, httpOnly: true, secure: true })

        res.setHeader('Authorization', `Bearer ${accessToken}`)
        res.setHeader('x-refresh-token', refreshToken)

        res.status(201).json({ message: "SignIn SuccessFully" })
    } catch (error) {
        console.log(error)
    }
}
