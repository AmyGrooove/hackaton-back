import { Module } from "@nestjs/common"
import { ChartDataController } from "./chart-data.controller"
import { ChartDataService } from "./chart-data.service"
import { MongooseModule } from "@nestjs/mongoose"
import { Dashboards, DashboardsSchema } from "./schemas/dashboards.schema"
import { UsersModule } from "../users/users.module"
import { HttpModule } from "@nestjs/axios"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboards.name, schema: DashboardsSchema },
    ]),
    UsersModule,
    HttpModule,
  ],
  controllers: [ChartDataController],
  providers: [ChartDataService],
})
export class ChartDataModule {}
