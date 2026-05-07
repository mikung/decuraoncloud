import {
  Get,
  Injectable,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import * as md5 from 'md5';
import { JwtService } from '@nestjs/jwt';
import { AppService } from 'src/app.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private appService: AppService,
  ) {}

  @Post('login')
  async signIn(@Body() body: any): Promise<{ access_token: string }> {
    let doctorname = '';
    let licenseno = '';
    let ename = '';
    let signature_jpeg_blob = '';
    const { username, password } = body; // ดึงข้อมูลจาก body
    const passweb = md5(password);
    const user: any = await this.appService.getOpduser(username);
    if (
      !user ||
      user.length === 0 ||
      user[0].passweb.toUpperCase() !== passweb.toUpperCase()
    ) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user[0].account_disable === 'Y') {
      throw new UnauthorizedException('Account is disabled');
    }

    if (
      user[0].doctorcode !== null ||
      user[0].doctorcode !== undefined ||
      user[0].doctorcode !== ''
    ) {
      const dataDoctor: any = await this.appService.getDoctor(
        user[0].doctorcode,
      );
      doctorname = dataDoctor[0].name;
      licenseno = dataDoctor[0].licenseno;
      ename = dataDoctor[0].ename;
      console.log(dataDoctor)
      // if(dataDoctor[0].signature_jpeg_blob !== null ) {
      //   signature_jpeg_blob = Buffer.from(dataDoctor[0].signature_jpeg_blob).toString('base64');
      // }else{
        signature_jpeg_blob = '';
      // }
    }

    const payload = {
      sub: user[0].name,
      username: user[0].loginname,
      role: user[0].accessright,
      doctorcode: user[0].doctorcode,
      doctorname: doctorname,
      licenseno: licenseno,
      signature_jpeg_blob: signature_jpeg_blob,
      groupname: user[0].groupname,
      cid: user[0].cid,
      ename: ename,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  //* ********************************************************************************************************************
  //* ********************************************************************************************************************
  @Post('loginpassweb')
  async signInpassweb(@Body() body: any): Promise<{ access_token: string }> {
    let doctorname = '';
    let licenseno = '';
    let ename = '';
    let signature_jpeg_blob = '';
    const { username, passweb } = body; // ดึงข้อมูลจาก body

    const user: any = await this.appService.getOpduser(username);
    if (
      !user ||
      user.length === 0 ||
      user[0].passweb.toUpperCase() !== passweb.toUpperCase()
    ) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (
      user[0].doctorcode !== null ||
      user[0].doctorcode !== undefined ||
      user[0].doctorcode !== ''
    ) {
      const dataDoctor: any = await this.appService.getDoctor(
        user[0].doctorcode,
      );
      if(dataDoctor[0].signature_jpeg_blob !== null) {
        signature_jpeg_blob = Buffer.from(dataDoctor[0].signature_jpeg_blob).toString('base64');
      }
      doctorname = dataDoctor[0].name;
      licenseno = dataDoctor[0].licenseno;
      ename = dataDoctor[0].ename;
    }

    const payload = {
      sub: user[0].name,
      username: user[0].loginname,
      role: user[0].accessright,
      doctorcode: user[0].doctorcode,
      doctorname: doctorname,
      groupname: user[0].groupname,
      licenseno: licenseno,
      signature_jpeg_blob: signature_jpeg_blob,
      cid: user[0].cid,
      ename: ename,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  //* ********************************************************************************************************************
  //* ********************************************************************************************************************

  @Post('user')
  async user(@Req() request: Request) {
    try {
      const accessToken =
        request.headers.authorization?.replace('Bearer ', '') || '';
      if (!accessToken) {
        throw new UnauthorizedException('Authorization token is missing');
      }
      const payload = await this.jwtService.verifyAsync(accessToken);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
