import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { ChartDataService } from "./chart-data.service"
import { Request } from "express"
import { AccessTokenGuard } from "../auth/guards/accessToken.guard"
import { ChartDataDto } from "./dto/chartData.dto"
import { GiveAccessDto } from "./dto/giveAccess.dto"
import { FileInterceptor } from "@nestjs/platform-express"
import { UrlDataDto } from "./dto/urlData.dto"

@Controller("chart")
export class ChartDataController {
  constructor(private chartData: ChartDataService) {}

  @UseGuards(AccessTokenGuard)
  @Post("generate")
  generateChart(@Req() req: Request, @Body() chartData: ChartDataDto) {
    return this.chartData.generateChart(chartData, req)
  }

  @UseGuards(AccessTokenGuard)
  @Post("uploadUrl")
  uploadUrl(@Req() req: Request, @Body() chartData: UrlDataDto) {
    return this.chartData.uploadUrl(chartData, req)
  }

  @UseGuards(AccessTokenGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadJson(
    @Req() req: Request,
    @UploadedFile() file: any,
    @Body() fileName: any,
  ) {
    return this.chartData.uploadJson(req, file, fileName.fileName)
  }

  @UseGuards(AccessTokenGuard)
  @Get("getChart")
  getChart(@Req() req: Request, @Query() id: any) {
    return this.chartData.getChart(req, id.id)
  }

  @UseGuards(AccessTokenGuard)
  @Post("giveAccessAnother")
  giveAccessAnother(@Req() req: Request, @Body() chartData: GiveAccessDto) {
    return this.chartData.giveAccessAnother(req, chartData)
  }
}
