import { Body, Controller, Post, Get, Query, HttpStatus, HttpException, Next, Req, Res, UseGuards, Request} from "@nestjs/common";
import { Response,NextFunction } from 'express';
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth-guard";
import { JwtAuthGuard } from "./jwt-auth-guard";
import { AuthGuard } from '@nestjs/passport';


@Controller("users")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  addUsers(
    @Body("fullName") userFullName: string,
    @Body("email") userEmail: string,
    @Body("password") userPassword: string
  ) {
    const data = this.authService.createUsers(
        userFullName,
        userEmail,
        userPassword
    );
    return data;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, ): any {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    // Handles the Google OAuth2 callback
    const jwt: string = await this.authService.createToken(req.user);
    console.log(req.user)
    // Now you could redirect the user to the frontend with the token
    res.redirect(`https://dynamic-unicorn-bea0db.netlify.app/?jwt=${jwt}`);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  verifyUsers(@Request() req, @Body("otpCode") otpCode: string,) {

    const userId = req.user.userId;
    const data = this.authService.verifyUsers(userId, otpCode);
    return data;
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.authService.forgotPassword(email);
      return { message: 'Password reset email sent ' };
    } catch (error) {
      throw new HttpException('Error sending password reset email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
    @Query('userId') userId: string // Include userId parameter
  ) {
    try {
      const response = await this.authService.resetPassword(token, userId, newPassword);
      return (response); // Assuming authService returns a response object
    } catch (error) {
      console.error('Error resetting password:', error);
      return ({ 'message': 'Password reset failed' });
    }
  }
  
  

  // @Post('login')
  // async login(
  // @Body("email") userEmail: string,
  // @Body("password") userPassword: string, 
  // @Res() res: Response, @Next() next: NextFunction) {
  //   try {
  //     const user = await this.authService.validateUser(userEmail.toLowerCase(), userPassword);
  //     if (!user) {
  //       throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  //     }

  //     const token = await this.authService.createToken(user);
  //     res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
  //     res.status(HttpStatus.OK).json({
  //       status: 'success',
  //       user,
  //       token,
  //     });
  //   } catch (error) {
  //     next(new HttpException(`Internal Server Error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR));
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers(@Query("userId") userId: string) {
    const data = this.authService.getUsers(userId);
    return data;
  }

//   @Patch()
//   updateProduct(
//     @Query("productId") prodId: any,
//     @Body("title") prodTitle: string,
//     @Body("description") prodDesc: string,
//     @Body("price") prodPrice: number
//   ) {
//     const data = this.productService.updateProduct(
//       prodId,
//       prodTitle,
//       prodDesc,
//       prodPrice
//     );
//     return data;
//   }

//   @Delete()
//   deleteProduct(@Query("productId") prodId: any) {
//     const data = this.productService.deleteProduct(prodId);
//     return data;
//   }

}

 


