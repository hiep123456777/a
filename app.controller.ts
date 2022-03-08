import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppService } from './app.service';
import Password from 'antd/lib/input/Password';
import {Response, Request} from 'express';
import { request } from 'http';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService) {}

 @Post('register')
 async register(
   @Body (' name') name:string,
   @Body (' email') email:string,
   @Body (' password') password:string
 ){
   const hashedPassword = await bcrypt.hash(password, 12 )
   return this.appService.Create({
     name,
     email, 
     password : hashedPassword 
   });
  }
  @Post('login')
  async login(
    @Body (' passwword') password:string,
   @Body (' email') email:string,
   @Res ({passthrough : true}) response: Response
      

  ){
    const user = await this.appService.FindOne({email})
    if (!user){
      throw new BadRequestException ('invalid credential')

    }
    if( !await bcrypt.compare(password, user.password)){
      throw new BadRequestException ('invalid credential')
    }
    const jwt = await this.jwtService.signAsync({id: user.id})
    response.cookie('jwt', jwt, {httpOnly: true});
    return {
      message: 'ok'
    };
  }
  @Get('user')
  async user ( @Req() request: Request ){
    try {
      const cookie = request.cookies[' jwt '];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }
      const user = await this.appService.FindOne({id : data['id']});
      const {password,... result} = user;
      return result;
    }catch (error) {
      throw new UnauthorizedException();
    }
  }
  @Post('logout')
    async logout (@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

      return {
            message: 'ok'
        }
    }
  
}   
