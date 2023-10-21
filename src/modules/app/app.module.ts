import { Module } from "@nestjs/common"
import { ChartDataModule } from "../chart-data/chart-data.module"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { UsersModule } from "../users/users.module"
import { AuthModule } from "../auth/auth.module"
import { AppController } from "./app.controller"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ChartDataModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
