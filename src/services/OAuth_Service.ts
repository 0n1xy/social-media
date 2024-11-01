
import jwt, { SignOptions } from 'jsonwebtoken';

class AuthenticationService {
  private accessKey: string;
  private refreshKey: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor() {
    this.accessKey = process.env.ACCESS_SECRET_KEY || 'my_secret_key_123';  //Get ACCESS_SECRET_KEY from .env
    this.refreshKey = process.env.REFRESH_SECRET_KEY || 'my_secret_key_123';  //Get REFRESH_SECRET_KEY from .env
    this.accessTokenExpiry = '24h'; //Access_Token expire in 1 day
    this.refreshTokenExpiry = '7d' //Refresh_Token expire in 7 days
  }

  //Create Access_Token
  public async accessToken(userId: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      const payload = {id: userId};
      const options: SignOptions = { expiresIn: this.accessTokenExpiry };

      jwt.sign(payload, this.accessKey, options, (err, token) => {
        if (err) {
          rejects(new Error('Failed to generate access token'));
        } else {
          resolve( token as string);
        }
      });
    }); 
  }

  //Create Refresh_Token
  public async refreshToken(userId: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      const payload = {id: userId};
      const options: SignOptions = { expiresIn: this.refreshTokenExpiry };

      jwt.sign(payload, this.refreshKey, options, (err, token) => {
        if (err) {
          rejects(new Error('Failed to generate refresh token'));
        } else {
          resolve( token as string);
        }
      });
    }); 
  }

  async generationAccessToken(userId: string): Promise<string> {
    return this.accessToken(userId);
  }

  async generationRefreshToken(userId: string): Promise<string> {
    return this.refreshToken(userId);
  }

  public async verifyAccessToken(token: string): Promise<any> {
    return new Promise((resolve, rejects) => {
      jwt.verify(token, this.accessKey, (err, decoded) => {
        if (err) {
          rejects(new Error('Invalid Token!'));
        } else {
          resolve(decoded);
        }
      });
    });
  }

  // Verify Refresh_Token
  public async verifyRefreshToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.refreshKey, (err, decoded) => {
        if (err) {
          reject(new Error('Invalid Refresh Token!'));
        } else {
          resolve(decoded);
        }
      });
    });
  }

  public async regenerateAccessToken(refreshToken: string): Promise<string> {
    try {
      // Verify the refresh token
      const decoded = await this.verifyRefreshToken(refreshToken);
      
      // If valid, generate a new access token using the user ID from the refresh token payload
      const newAccessToken = await this.accessToken(decoded.id);
      return newAccessToken;

    } catch (error: any) {
      throw new Error('Unable to regenerate access token: ' + error.message);
    }
  }
}

export default AuthenticationService;