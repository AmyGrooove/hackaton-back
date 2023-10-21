import { BadRequestException, Injectable } from "@nestjs/common"
import { IChartData } from "./types/chartData"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Request } from "express"
import { UsersService } from "../users/users.service"
import { ChartDataDto } from "./dto/chartData.dto"
import { Dashboards } from "./schemas/dashboards.schema"
import { GiveAccessDto } from "./dto/giveAccess.dto"

const randomNumber = (max: number) => Math.floor(Math.random() * max)

const getRandomDate = (baseDate: Date, count: number): Date =>
  new Date(baseDate.getTime() + (count * 5 + 1) * 24 * 60 * 60 * 1000)

@Injectable()
export class ChartDataService {
  constructor(
    @InjectModel(Dashboards.name) private dashBoardsModel: Model<Dashboards>,
    private usersService: UsersService,
  ) {}

  async generateChart(chartDataDto: ChartDataDto, req: Request) {
    const userId = req.cookies?.userId

    if (!userId) throw new BadRequestException("userId not exist")

    const chartData: IChartData[] = new Array(chartDataDto.count)
      .fill(0)
      .map(() => ({
        id: new Types.ObjectId(),
      }))

    chartData.forEach((el, index) => {
      chartData[index] = {
        ...el,
        values: new Array(randomNumber(50))
          .fill(0)
          .map(() => ({
            time: getRandomDate(new Date(), randomNumber(30)),
            value: randomNumber(1000),
          }))
          .sort((a, b) => a.time.getTime() - b.time.getTime()),
      }
    })

    const createdDashboards = new this.dashBoardsModel({
      name: chartDataDto.name,
      data: chartData,
    })
    const dashboardData = await createdDashboards.save()

    const { accessCharts } = await this.usersService.findById(userId)
    await this.usersService.update(userId, {
      accessCharts: [...accessCharts, dashboardData._id],
    })

    return true
  }

  async getChart(id?: string) {
    if (!id) throw new BadRequestException("no id")

    return this.dashBoardsModel
      .findOne({ _id: new Types.ObjectId(id) })
      .lean()
      .exec()
  }

  async giveAccessAnother(req: Request, chartData: GiveAccessDto) {
    const userId = req.cookies?.userId

    if (!userId) throw new BadRequestException("userId not exist")

    if (!chartData.dashboardId) throw new BadRequestException("no dashboardId")
    if (!chartData.username) throw new BadRequestException("no username")

    const addUser = await this.usersService.findByUsername(chartData.username)
    const mainUser = await this.usersService.findById(userId)

    if (
      !mainUser.accessCharts.find(
        (chart) => String(chart) === chartData.dashboardId,
      )
    )
      throw new BadRequestException("dont have permission")
    if (
      addUser.accessCharts.find(
        (chart) => String(chart) === chartData.dashboardId,
      )
    )
      throw new BadRequestException("already have")
  }
}
