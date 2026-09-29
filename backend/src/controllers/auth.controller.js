// signup, login, logout, forget-password

import User from "../models/user.model.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import forgotPasswordEmail from "../emails/forgotpassword.js";
import { sendEmail } from "../services/email.service.js";
import welcomeEmail from "../emails/welcome.js";

const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const user = req.body;

        // hashing the password
        const hashedPwd = await hash(user.password, 10);

        const newUser = { ...user, password: hashedPwd };

        // check user exist or not
        const checkUser = await User.findOne({email});
        if(checkUser){
            return res.status(400).json({
                message : "User Already Exist"
            })
        }

        // store it in db
        const db_res = await User.create(newUser);
        // console.log(db_res);

        const to = email;
        const subject = "Welcome to Quizzify!";
        const loginLink = process.env.FRONTEND_BASE_URL + "/login";
        const html = welcomeEmail(name, loginLink);

        const mail = await sendEmail(to, subject, html);

        // send the response
        res.status(201).json({
            message: "Account Created, Please Login!",
            // user : db_res
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const login = async (req, res) => {
    try {
        // req.body => email, pwd
        const { email, password: pwd } = req.body;

        // look for the user in db
        const data = await User.findOne({ email });

        if (!data) {
            return res.status(401).json({
                message: "User does not exist",
            });
        }

        // compare pwd
        const hashedPwd = data.password;
        const result = await compare(pwd, hashedPwd);

        if (!result) {
            return res.status(401).json({
                message: "Incorrect password or email",
            });
        }

        // generate jwt token
        const payload = {
            id: data._id,
            // email, pwd, other data
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
        // console.log("token", token);

        // 1. in cookies
        res.cookie("token", token, {
            httpOnly: true, // restrict the access of cookie via JavaScript code
            secure: true,
            sameSite: "none"
        });

        // 2. inside json
        return res.status(201).json({
            message: "Logged in",
            user: {
                name: data.name,
                email: data.email,
                profilePic: data.profilePic,
                aiQuizGeneratedCount: data.aiQuizGeneratedCount,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(201).json({
            message: "Logout success",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        // 1. Expecting => email
        const { email } = req.body;

        // 2. Verify email in DB
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }

        // 3. Create a token
        const id = user._id;
        const payload = { id };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });

        // 4. Create a link
        const link = `${process.env.FRONTEND_BASE_URL}/reset-password/${token}`;

        // 5. Template for email
        const html = forgotPasswordEmail(link);

        // 6. Send the email
        const subject = "Reset Your Password";
        const respose = await sendEmail(email, subject, html);

        // 7. res => success
        return res.status(200).json({
            message: "Link sent to your email!",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Server Error",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        // 1. token => params
        const { token } = req.params;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. Token not found",
            });
        }

        // 2. password for update
        const { password } = req.body;

        // 3. verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // 4. id from token
        const id = payload.id;

        // 5. search in DB
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                message : "User Not Found"
            })
        }

        // 6. Hash the new pwd
        const hashedPwd = await hash(password, 10);

        // 7. Update in DB
        const resposne = await User.findByIdAndUpdate(id, {password : hashedPwd});

        // 8. res => success
        return res.status(200).json({
            message : "Password Updated, Please Login again"
        })
    } 
    catch (err) {
        return res.status(500).json({
            message : "Server Error"
        })
    }
};

export { signup, login, logout, forgotPassword, resetPassword };
