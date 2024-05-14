import { Body, Controller, Post, Get, Query, HttpStatus, HttpException, Next, Req, Res} from "@nestjs/common";
import { Response,NextFunction } from 'express';
import { AuthService } from "./auth.service";


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

  @Post('login')
  async login(
  @Body("email") userEmail: string,
  @Body("password") userPassword: string, 
  @Res() res: Response, @Next() next: NextFunction) {
    try {
      const user = await this.authService.validateUser(userEmail.toLowerCase(), userPassword);
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const token = await this.authService.createToken(user);
      res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
      res.status(HttpStatus.OK).json({
        status: 'success',
        user,
        token,
      });
    } catch (error) {
      next(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

   // @Get()
  // getUsers(@Query("userId") userId: string) {
  //   const data = this.authService.getUsers(userId);
  //   return data;
  // }

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

 


