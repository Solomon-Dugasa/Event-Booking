import { Response, Request } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { Role } from "../models/User";

interface RequestBody {
    name: string;
    email: string;
    password: string;
}

// Register a new user
export const register = async (
    req: Request<{}, {}, RequestBody>,
    res: Response
) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: Role.USER
        })

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        )

        res.status(201).json({ 
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token 
        });


    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

// Login user

interface LoginBody {
    email: string,
    password: string
}

export const login = async (
    req: Request< {}, {}, LoginBody>,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email})

        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        )

        res.status(200).json({ 
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

// Get current user
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//Get total users count (admin only)
export const getUserCount = async (req: AuthRequest, res: Response) => {
    try {
        const count = await User.countDocuments();  
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};