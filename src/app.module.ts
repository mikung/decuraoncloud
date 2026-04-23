import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CreditsController } from './credits/credits.controller';
import { CreditsService } from './credits/credits.service';

@Module({
  imports: [ConfigModule.forRoot(),],
  controllers: [AppController, CreditsController],
  providers: [AppService, PrismaService, CreditsService],
})
export class AppModule {}
