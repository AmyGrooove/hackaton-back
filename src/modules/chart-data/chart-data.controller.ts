import { Controller, Get, Query } from "@nestjs/common"
import { ChartDataService } from "./chart-data.service"

@Controller("chart")
export class ChartDataController {
  constructor(private chartData: ChartDataService) {}

  @Get("generate")
  generateData(@Query("count") count) {
    return this.chartData.generateChart(Number(count))
  }
}
