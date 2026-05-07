import {
  Get,
  Injectable,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from 'src/app.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private appService: AppService,
  ) {}


}
