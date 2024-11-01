import { Request, Response, NextFunction } from 'express';
import AuthenticationService from '@/services/OAuth_Service';

const authService = new AuthenticationService();

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.header('access-token') as string | undefined; // Get access token from header 
    const refreshToken = req.header('refresh-token') as string | undefined; // Get refresh token from header 

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
        if (accessToken) {
            const decoded = await authService.verifyAccessToken(accessToken);
            next(); // Allow the request to proceed to the next route
        } else if (refreshToken) {
            const newAccessToken = await authService.regenerateAccessToken(refreshToken);
            res.setHeader('access-token', newAccessToken); // Send new access token in response headers
            next();
        }
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};
