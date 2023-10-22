import { Types } from "mongoose"

interface IDashboard {
  id: Types.ObjectId
  name: string
  data: IChartData[]
  uploadUrl: string
}

interface IChartData {
  id: Types.ObjectId
  values: { time: Date; value: number }[]
}

export type { IDashboard, IChartData }
