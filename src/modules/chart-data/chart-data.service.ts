import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Request } from "express"
import { UsersService } from "../users/users.service"
import { ChartDataDto } from "./dto/chartData.dto"
import { Dashboards } from "./schemas/dashboards.schema"
import { GiveAccessDto } from "./dto/giveAccess.dto"
import { HttpService } from "@nestjs/axios"
import { UrlDataDto } from "./dto/urlData.dto"

const randomNumber = (max: number) => Math.floor(Math.random() * (max - 1)) + 1

const getRandomDate = (baseDate: Date, count: number): Date =>
  new Date(baseDate.getTime() + (count * 5 + 1) * 24 * 60 * 60 * 1000)

const validateUrl = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/

@Injectable()
export class ChartDataService {
  constructor(
    @InjectModel(Dashboards.name) private dashBoardsModel: Model<Dashboards>,
    private usersService: UsersService,
    private httpService: HttpService,
  ) {}

  async generateChart(chartDataDto: ChartDataDto, req: Request) {
    const userId = req.cookies?.userId

    if (!userId) throw new BadRequestException("userId not exist")

    try {
      const chartData = new Array(chartDataDto.count ?? randomNumber(10))
        .fill(0)
        .map(() => ({
          _id: new Types.ObjectId(),
          values: new Array(randomNumber(50))
            .fill(0)
            .map(() => ({
              time: getRandomDate(new Date(), randomNumber(30)),
              value: randomNumber(1000),
            }))
            .sort((a, b) => a.time.getTime() - b.time.getTime()),
        }))

      const createdDashboards = new this.dashBoardsModel({
        _id: new Types.ObjectId(),
        name: chartDataDto.name,
        data: chartData,
      })
      const dashboardData = await createdDashboards.save()

      const { accessCharts } = await this.usersService.findById(userId)
      await this.usersService.update(userId, {
        accessCharts: [...accessCharts, String(dashboardData._id)],
      })

      return true
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async uploadJson(req: Request, file?: any, fileName?: string) {
    const userId = req.cookies?.userId

    if (!userId) throw new BadRequestException("userId not exist")
    if (!file.originalname.includes("json"))
      throw new BadRequestException("file is not json")

    try {
      const jsonFile = JSON.parse(Buffer.from(file.buffer).toString("utf-8"))

      const createdDashboards = new this.dashBoardsModel({
        _id: new Types.ObjectId(),
        name: fileName,
        data: jsonFile,
      })
      const dashboardData = await createdDashboards.save()

      const { accessCharts } = await this.usersService.findById(userId)
      await this.usersService.update(userId, {
        accessCharts: [...accessCharts, String(dashboardData._id)],
      })

      return true
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async uploadUrl(urlData: UrlDataDto, req: Request) {
    const userId = req.cookies?.userId

    if (!userId) throw new BadRequestException("userId not exist")
    if (!validateUrl.test(urlData.url))
      throw new BadRequestException("no valid url")

    try {
      JSON.parse((await this.httpService.get(urlData.url).toPromise()).data)
    } catch (error) {
      throw new BadRequestException("file not json")
    }

    try {
      const createdDashboards = new this.dashBoardsModel({
        _id: new Types.ObjectId(),
        name: urlData.name,
        uploadUrl: urlData.url,
      })
      const dashboardData = await createdDashboards.save()

      const { accessCharts } = await this.usersService.findById(userId)
      await this.usersService.update(userId, {
        accessCharts: [...accessCharts, String(dashboardData._id)],
      })

      return true
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async getChart(req: Request, id?: string) {
    const userId = req.cookies?.userId

    if (!userId) throw new BadRequestException("userId not exist")
    if (!id) throw new BadRequestException("no id")

    const user = await this.usersService.findById(userId)

    if (!user.accessCharts.find((chart) => String(chart) === id))
      throw new BadRequestException("dont have permission")

    const dashboard = await this.dashBoardsModel
      .findOne({ _id: new Types.ObjectId(id) })
      .lean()
      .exec()

    return dashboard.uploadUrl
      ? (await this.httpService.get(dashboard.uploadUrl).toPromise()).data
      : dashboard
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
