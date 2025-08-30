


import type {Request,Response} from 'express';

import {createUser,findUserByEmail} from '../services/authService.js';

export async function register(req:Request,res:Response){
    // take email and password from request body
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }
    // check if user already exists
    const existing = await findUserByEmail(email);
    if(existing){
        return res.status(409).json({message: "User already exists"});
    }
    // create user
    await createUser({email,password});
    // respond with success message
    res.status(201).json({message: "User registered successfully"});
}

export async function login(req:Request,res:Response){
    res.status(200).json({message: "User logged in successfully"});
}

export async function verifyEmail(req:Request,res:Response){
    res.status(200).json({message: "Email verified successfully"});
}
export async function verifyPhone(req:Request,res:Response) {
    res.status(200).json({message: "Phone number verified successfully"});
}

export async function logout(req:Request,res:Response){
    res.status(200).json({message: "User logged out successfully"});
}

export async function getUserProfile(req:Request,res:Response) {
    res.status(200).json({message: "User profile retrieved successfully"});
}
export async function updateUserProfile(req:Request,res:Response) {
    res.status(200).json({message: "User profile updated successfully"});
}

export async function deleteUserAccount(req:Request,res:Response) {
    res.status(200).json({message: "User account deleted successfully"});
}
export async function forgotPassword(req:Request,res:Response) {
    res.status(200).json({message: "Password reset link sent to email"});
}

export async function resetPassword(req:Request,res:Response) {
    res.status(200).json({message: "Password reset successfully"});
}


