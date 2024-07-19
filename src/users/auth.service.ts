import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { randomBytes } from 'crypto';
import { User } from "./users.model";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../utils/mail.service';
import { GenerateOTP } from "../utils/generate.otp";

interface UserWithResetToken {
  _id: number;
  resetToken: string;
  resetTokenExpiration: number;
  fullName: string;
  email: string;
  password: string;
  userId: string;
  country: string;
  verified: string;
  authStrategy: string;
  phoneNumber: string;
  otpCode: string;
  image: { url: string, format: string, public_id: string }
}

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    //private readonly usersService: UsersService,
    private readonly generateOtp: GenerateOTP,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService
  ) {}

  async createUsers(fullName: string, email: string, password: string ) {
    const userId = uuidv4();
    email = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10)
    password = hashedPassword;
    const otpCode = `${this.generateOtp.OTP(6)}`
    // const newUser = { email, fullName, userId };
    // console.log({newUser})
    const token = await this.jwtService.sign({email, fullName, userId})
    if (! token) {
      return "No JWT Token Attached"
    }
    console.log({otpCode})
    const user = await this.userModel.findOne({email: email})
    if (user) {
      return "User Already Registered"
    } else {
      await this.mailService.sendMail(email, "Verify Your Email", "OTP Code", otpCode )
      const newUser = new this.userModel({ userId, fullName, email, password, otpCode, token });
      const data = await newUser.save();
      return {data,token};
    }


   
  }

  // for Oauth2 Authentication ==> used in googleStrategy for google authStrategy
  async findOrCreateUser(profile: any) {
    let user = await this.userModel.findOne({ userId: profile.userId });

    if (!user) {
      user = await new this.userModel(profile).save(); // Create user if they don't exist
    }

    return user; // Return user whether it existed or was just created
  }

  async validateUser(email: string, password: string): Promise<any> {
    try{
      const user = await this.userModel.findOne({email});
      const token = await this.createToken(user);
      if (user && await this.isValidPassword(password,email)) {
        const { password , ...rest } = user
        return { user, token };
      }
      return null;
    }catch(e){
      return e
    }
  }

  async createToken(user: any) {
    //const payload = { user };
    const User = await this.userModel.findOne({email: user.email});

    const token = await this.jwtService.sign({email:User.email, fullName:User.fullName, userId:User.userId})
    if (! token) {
      return "No JWT Token Attached"
    }
    return token
    

    // return this.jwtService.sign(payload);
  }

  async verifyUsers(userId:string, otpCode: string) {
    if (!userId) {
      throw new NotFoundException(
        `The User with the id ${userId} no longer exists`
      );
    } else {
      const updatedUser = await this.userModel.findOne({userId: userId})
      if (updatedUser.otpCode !== otpCode){
        return 'The Otp Code you Entered Is Incorrect'
      } else{
        updatedUser.otpCode = "";
        updatedUser.verified = true;
        await updatedUser.save()
        return 'User Successfully Verified'
      }

    }
  }


  async getUsers(query: any) {
    if (!query) {
      const data = await this.userModel.find().exec();
      return data as User[]
    } else {
      const user = this.findUser(query);
      return user;
    }
  }

  private async findUser(id: string): Promise<User> {
    const user = await this.userModel.findOne({userId: id})

    if (!user) {
      throw new NotFoundException(`Could Not Find User with the id ${id}`);
    }
    return  user;
  }

  async  isValidPassword(password: string, email: string) {
    const user = await this.userModel.findOne({email});
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  };

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({email});

    if (!user) {
      throw new NotFoundException(
        `The User with the email: ${email} does not exist`
      );
    } else {
          const resetToken = randomBytes(32).toString('hex');
          const id: any = user.userId;
          console.log(id)
           const expiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
           await this.userModel.updateOne({userId:id}, { resetToken, resetTokenExpiration: expiration });

        const resetLink = `http://localhost:3000/users/reset-password?token=${resetToken}&userId=${id}`; // Replace with your reset password URL

        const textBody = `You have requested a password reset for your account. Please click the following link to reset your password within 24 hours: ${resetLink}`;

        await this.mailService.sendMail(email, "Password Reset Request", "Reset Link", textBody )

    }

  }

  async resetPassword(token: string, userId: string, newPassword: string) {
    // Find user by ID
    const user = await this.userModel.findOne({userId}) as UserWithResetToken;
    if (!user) {
      throw new Error('User not found');
    }

    // Check if reset token is valid
    if (user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash the new password
    const hashedPassword = await this.hashPassword(newPassword); // Replace with your password hashing logic

    // Update user model with new password and remove reset token
    await this.userModel.updateOne(
      { userId: user.userId },
      { $unset: { resetToken: 1 }, password: hashedPassword }
    );

    return { message: 'Password reset successful' };
  }

  private async hashPassword(newPassword: string): Promise<string> {
    const saltRounds = 10; // Adjust this value based on your security needs (higher = more secure, but slower)
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(newPassword, salt);
      return hash;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  async changePassword(email: string, currentPassword: string, newPassword: string, confirmPassword: string) {
    const user = await this.userModel.findOne({ email }); // Find user by userdid
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    ); console.log(currentPassword, user.password);
  
    if (!isPasswordValid) {
      throw new Error('Incorrect current password');
    }
  
    if (newPassword !== confirmPassword) {
      throw new Error('New password and confirm password do not match');
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
  
    await user.save();
  
    return { message: 'Password changed successfully' };
  }

  async updateMe(query: any, data: any, 
    // name: string, phoneNumber: string, country: string
  ) {
    if (!query) {
      throw new NotFoundException(
        `The User with the id ${query} no longer exists`
      );
    } else {
      const updatedUser:any = await this.findUser(query);
      console.log(data)

      if (data.name) {
        updatedUser.fullName = data.name;
      }
      if (data.phoneNumber) {
        updatedUser.phoneNumber = data.phoneNumber;
      }
      if (data.country) {
        updatedUser.country = data.country;
      }
      if (data.photo) {
        updatedUser.photo = data.photo;
      }

    await updatedUser.save();
    return updatedUser;
    }
  }
  
}
