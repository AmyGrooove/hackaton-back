import { ObjectId } from "mongoose"

type FindByUsername = {
  _id: ObjectId
  username: string
  image: string | null
  role: string
  accessCharts: any
}

export type { FindByUsername }
