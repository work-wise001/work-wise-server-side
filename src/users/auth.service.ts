import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./users.model";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    //private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async createUsers(fullName: string, email: string, password: string ) {
    const userId = uuidv4();
    email = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10)
    password = hashedPassword;
    //const JWT_SECRET = process.env.JWT_SECRET;
    // const token = await jwt.sign(
    //   { fullName: user.fullName, email: user.email, _id: user._id },
    //   JWT_SECRET
    // );
    const newUser = new this.userModel({ userId, fullName, email, password });
    const data = await newUser.save();
    return data;
  }

  async validateUser(email: string, password: string): Promise<any> {
    try{
      const user = await this.userModel.findOne({email});
      if (user && await this.isValidPassword(password,email)) {
        const { password , ...rest } = user
        return user;
      }
      return null;
    }catch(e){
      return e
    }
  }

  async createToken(user: any) {
    const payload = { user };
    const User = await this.userModel.findOne({email: user.email});

    const token = await this.jwtService.sign({fullname:User.fullName, email:User.email})
    if (! token) {
      return "No JWT Token Attached"
    }
    return token
    

    // return this.jwtService.sign(payload);
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
