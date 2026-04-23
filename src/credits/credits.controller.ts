import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreditsService } from './credits.service';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}
  @Get('/status/:hospcode/:project_id')
  async getStatus(
    @Param('hospcode') hospcode: string,
    @Param('project_id') project_id: any,
  ) {
    return await this.creditsService.getData(hospcode, project_id);
  }

   @Get('/reserve/:hospcode/:project_id/:slug')
  async getReserve(
    @Param('hospcode') hospcode: string,
    @Param('project_id') project_id: any,
    @Param('slug') slug: any,
  ) {
    return await this.creditsService.getReserve(hospcode, project_id, slug);
  }

   @Post('/debit')
  async debit(
    @Body() body: any
  ) {
    return await this.creditsService.debit(body);
  }
}
