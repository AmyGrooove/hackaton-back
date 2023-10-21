import { Types } from "mongoose"

interface IChartData {
  id: Types.ObjectId
  values?: { time: Date; value: number }[]
}

export type { IChartData }
