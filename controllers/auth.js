const { response } = require("express");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        // Check if user exists

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                ok: false,
                message: {
                    email: "Email already exists"
                }
            });
        }

        const user = new User(req.body);

        //Encript password

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //Generate JWT token
        const token = await generateJWT(user.id);

        await user.save();

        res.json({
            ok: true,
            user,
            token
        });

    }
    catch (error) {
        return res.status(400).json({
            ok: false,
            message: "Error comuníquese con el administrador",
        });
    }

}

const loginUser = async (req, res = response) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: "User doesn't exist"
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: "Password doesn't match"
            });
        }

        //Generate JWT token
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: "Error comuníquese con el administrador",
        });
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    try {

        const user = await User.findById(uid);

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: "User doesn't exist"
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: "Error comuníquese con el administrador",
        });
    }
}


module.exports = {
    createUser,
    loginUser,
    renewToken
}
