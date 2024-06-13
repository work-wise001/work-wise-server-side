import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./users.model";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../utils/mail.service';
import { GenerateOTP } from "src/utils/generate.otp";

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



}
