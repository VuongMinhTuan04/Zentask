import { signInService, signOutService, signUpService, changeInfoService, changePasswordService, forgotPasswordService } from "../services/authService.js";

export const signIn = async (req, res) => {
    try {
       const data = await signInService(req.body);
       
       res.status(200).json({ message: 'Sign In Success', ...data });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}

export const signUp = async (req, res) => {
    try {
        const user = await signUpService(req.body);

        res.status(201).json({ message: 'Sign Up Success', user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const signOut = async (req, res) => {
    try {
        await signOutService();

        res.status(200).json({ message: "Sign Out Success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const changeInfo = async (req, res) => {
    try {
        const user = await changeInfoService(req.user.userId, req.body);

        res.status(200).json({ message: "Change Info Success", data: user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const changePassword = async (req, res) => {
    try {
        const change = await changePasswordService(req.user.userId, req.body);
        
        res.status(200).json({ message: "Change Password Success" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(200).json({ message: "Username hợp lệ" });
        }

        await forgotPasswordService(req.userFound, password);

        res.status(200).json({ message: "Change Password Success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}