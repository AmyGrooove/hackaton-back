import { ObjectId } from "mongoose"

type FindByUsername = {
  _id: ObjectId
  username: string
  image: string | null
  role: string
  accessCharts: number[]
}

export type { FindByUsername }
