import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from 'src/app.service';
import { ConfigModule } from '@nestjs/config';
import { env } from 'process';

@Module({
  imports:[
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global:true,
      secret:"meaw_meaw",
      signOptions: { expiresIn: '1d'}
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,AppService]
})


export class AuthModule {}

