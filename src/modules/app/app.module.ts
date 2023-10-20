import { Module } from "@nestjs/common"
import { ChartDataModule } from "../chart-data/chart-data.module"

@Module({
  imports: [ChartDataModule],
})
export class AppModule {}
