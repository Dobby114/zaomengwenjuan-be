import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatService } from './stat.service';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}
  @Get(':id')
  getAnswerStat(
    @Param('id') id: string,
    @Query('pageSize') pageSize: number,
    @Query('pageNo') pageNo: number,
  ) {
    return this.statService.findAll(id, pageNo, pageSize);
  }
  @Get(':id/:componentId')
  getComponentStat(
    @Param('id') id: string,
    @Param('componentId') componentId: string,
  ) {
    return this.statService.genComponentStat(id, componentId);
  }
}
