import { Module } from "@nestjs/common"
import { ChartDataController } from "./chart-data.controller"
import { ChartDataService } from "./chart-data.service"

@Module({
  controllers: [ChartDataController],
  providers: [ChartDataService],
})
export class ChartDataModule {}
