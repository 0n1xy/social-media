import { Router } from "express";
import { registerValidator } from "@/validates/Auth_Validation";
import UserService from "@/services/User_Service";
import AuthenticationService from "@/services/OAuth_Service";

const router = Router();
const userService = new UserService();
const authService = new AuthenticationService(); // Tạo một thể hiện của UserService

router.post('/register', async (request, response) => {
    //Validate the request body (fix later - có vẻ là lỗi không báo đủ dữ liệu)
    // const { error } = registerValidator(request.body);
    // if (error) {
    //     return response.status(400).json({ message: error.details[0].message });
    // }

    const userData = request.body;

    try {
        // Gọi phương thức signUpMethod từ UserService
        const newUser = await userService.signUpMethod(userData);
        return response.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err: any) {
        console.error(err);
        return response.status(500).json({ message: err.message });
    }
});

router.post('/login', async (request, response) => {
    const userData = request.body;

    try {
        const loggedUser = await userService.loginMethod(userData);
        const accessToken = await authService.generationAccessToken(userData._id);
        const refreshToken = await authService.generationRefreshToken(userData._id);

        // Store access and refresh tokens in cookie
        response.cookie('accessToken', accessToken, {
            httpOnly: true,       // Accessible only by the web server
            secure: true,         // Send only over HTTPS
            sameSite: 'strict',   // Strict same-site policy
            maxAge: 24 * 60 * 60 * 1000 // expire in 1 day
        });

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // expire in 7 days
        });

        return response.header('access-token', accessToken).header('refresh-token', refreshToken).status(201).json({ 
            messsage: "Login successfully",
            accessToken,
            refreshToken,
        })
    } catch (err: any) {
        console.error(err);
        return response.status(500).json({ message: err.message});
    }  
});

export default router;
