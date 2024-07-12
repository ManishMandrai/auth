const User = require('../models/users');
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')

const test = (req, res) => {
    res.json('test is working')
}


//register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //check in name was entered
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        }
        //password check
        if (!password || password.length < 6) {
            return res.json({
                error: 'password required'
            })
        }
        //email check
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: 'email is taken'
            })
        }

        const hashedPassword = await hashPassword(passsword)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.json(user)
    } catch (error) {
        console.log
    }
}


//login
const loginUser = async (req, res) => {
    try {
        const { email, passsword } = req.body;

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                error: 'no user found '
            })
        }

        const match = await comparePassword(password, user.password)
        if (match) {
            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user)
            })
        }
        if (!match) {
            res.json({
                error: "password not match"
            })
        }

    } catch (error) {
        console.log(error)
    }
}

const getProfile = (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            res.json(user)
        })
    } else {
        res.json(null)
    }
}


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
}