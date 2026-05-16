import UserModel from "../models/usermodel.js";
import ResumeModel from "../models/resumemodel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userid) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
};

//User Registration Begins
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All the fields are required" });
        }

        //checking if user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create new user
        const newUser = await UserModel.create({
            name, email, password: hashedPassword
        });

        const token = generateToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        res.status(201).json({
            message: 'User created successfully', token,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        });


    } catch (error) {
        return res.status(400).json({ message: "Something went wrong" })
    }
}

//User Login Begins
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields must be filled" })
        };

        //check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email" });
        };

        //check if password is correct
        if (!(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        //return success message
        return res.status(200).json({
            message: "Login Successful", token,
            _id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// controller for getting current user
// GET: /api/users/data
export const getUserbyId = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.userid);
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }
        user.password = undefined;
        return res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.userid);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const resumes = await ResumeModel.find({ userId: req.user.userid });
        return res.status(200).json({ resumes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
