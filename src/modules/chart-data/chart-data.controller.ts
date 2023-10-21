import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common"
import { ChartDataService } from "./chart-data.service"
import { Request } from "express"
import { AccessTokenGuard } from "../auth/guards/accessToken.guard"
import { ChartDataDto } from "./dto/chartData.dto"
import { GiveAccessDto } from "./dto/giveAccess.dto"

@Controller("chart")
export class ChartDataController {
  constructor(private chartData: ChartDataService) {}

  @UseGuards(AccessTokenGuard)
  @Post("generate")
  generateChart(@Req() req: Request, @Body() chartData: ChartDataDto) {
    return this.chartData.generateChart(chartData, req)
  }

  @UseGuards(AccessTokenGuard)
  @Get("getChart")
  getChart(@Query() id: string) {
    return this.chartData.getChart(id)
  }

  @UseGuards(AccessTokenGuard)
  @Post("giveAccessAnother")
  giveAccessAnother(@Req() req: Request, @Body() chartData: GiveAccessDto) {
    return this.chartData.giveAccessAnother(req, chartData)
  }
}
