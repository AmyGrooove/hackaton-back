import { Module } from "@nestjs/common"
import { ChartDataController } from "./chart-data.controller"
import { ChartDataService } from "./chart-data.service"
import { MongooseModule } from "@nestjs/mongoose"
import { Dashboards, DashboardsSchema } from "./schemas/dashbords.schema"
import { UsersModule } from "../users/users.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboards.name, schema: DashboardsSchema },
    ]),
    UsersModule,
  ],
  controllers: [ChartDataController],
  providers: [ChartDataService],
})
export class ChartDataModule {}
