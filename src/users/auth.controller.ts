import { Body, Controller, Post, Get, Patch, Query, HttpStatus, HttpException, Next, Req, Res, UseGuards, Request, UploadedFile, UseInterceptors} from "@nestjs/common";
import { Response,NextFunction } from 'express';
import { AuthService } from "./auth.service";
import { FileService } from "../file/files.service";
import { LocalAuthGuard } from "./local-auth-guard";
import { JwtAuthGuard } from "./jwt-auth-guard";
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../middlewares/upload.config';


@Controller("users")
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly fileService: FileService) {}

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
    res.redirect(`https://dynamic-unicorn-bea0db.netlify.app/html/home?jwt=${jwt}`);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  verifyUsers(@Request() req, @Res() res, @Body("otpCode") otpCode: string) {

    const userId = req.user.userId;
    const data = this.authService.verifyUsers(userId, otpCode);
    // res.redirect(`https://dynamic-unicorn-bea0db.netlify.app/html/e_verify/?userId=${req.user.userId}`)

    return data;
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      const data = await this.authService.forgotPassword(email);
      return data

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
  
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
    @Req() req, // Inject the request object
  ) {
    try {
      // Retrieve the user information from the decoded JWT payload
      const user = req.user; // Assuming JwtAuthGuard decodes and attaches user data to request object
      //console.log(user); // Replace 'userId' with the actual claim name for user ID
  
      // Call your authService method with user information
      this.authService.changePassword(user.email, currentPassword, newPassword, confirmPassword);
  
      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateMe(
    @Body("name") name: string,
    @Body("phoneNumber") phoneNumber: string,
    @Body("country") country: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,

  ) {
    console.log(file)
    const userId = req.user.userId;
    let user;
    try {
      if (file) {
        if (req.user?.photo?.public_id) {
          await this.fileService.deleteFile(req.user.photo.public_id);
        }

        const image = await this.fileService.uploadSinglePhoto(file);
        console.log({image})

        user = await this.authService.updateMe(userId, {
          name,
          phoneNumber,
          country,
          photo: {
            url: image.secure_url,
            format: image.format,
            public_id: image.public_id,
          },
        });

        await this.fileService.unlinkFile(file.path);
      } else {
        user = await this.authService.updateMe(userId, {
          name,
          phoneNumber,
          country,
        });
      }

      return { message: 'user updated successfully', user };

    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    // try{
    //   if (req.file && req.file.fieldname === 'photo') {
    //     let previousPhotoUrl = '';
    //     if (req.user?.photo) {
    //       previousPhotoUrl = req.user.photo.public_id;
    //       if (previousPhotoUrl) {
    //         // delete previous file on cloudinary
    //         await this.fileService.deleteFile(previousPhotoUrl);
    //         const image = await this.fileService.uploadSinglePhoto(req.file);
        
    //       const user = await this.authService.updateMe(userId, {
    //         name,
    //         phoneNumber,
    //         country,
    //         photo:{
    //           url: image.secure_url,
    //           format: image.format,
    //           public_id: image.public_id
    //       }
    //     });
    //       await this.fileService.unlinkFile(req.file?.path)
    //       return (`'user updated successfully', ${ user }`);
    //       }
          
    //       const image = await this.fileService.uploadSinglePhoto(req.file);
        
    //       const user = await this.authService.updateMe(userId, {
    //         name,
    //         phoneNumber,
    //         country,
    //         photo:{
    //           url: image.secure_url,
    //           format: image.format,
    //           public_id: image.public_id
    //       }});
    //       await this.fileService.unlinkFile(req.file?.path)
    //       return (`user updated successfully, ${ user }`);
          
    //     }
  
    //     const image = await this.fileService.uploadSinglePhoto(req.file);
        
    //     const user = await this.authService.updateMe(userId, {
    //       name,
    //       phoneNumber,
    //       country,
    //       photo:{
    //         url: image.secure_url,
    //         format: image.format,
    //         public_id: image.public_id
    //     }});
        
    //     //return res.status(200).json(httpResponse('user updated successfully', { user }));
    //     return (`user updated successfully, ${ user }`)
  
    //   } else {
    //     const data = this.authService.updateMe(
    //       userId,
    //       //{body}
    //     { name,
    //       phoneNumber,
    //       country}
    //     );
    //     return data;
    //   }
    // } catch(error){
    //   console.log(error)
    //   throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    // }
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
  getUsers(@Query("userId") userId: string, @Req() req) {
    const data = this.authService.getUsers(userId);
    console.log({user: req.user})
    return data;
  }

}

 


