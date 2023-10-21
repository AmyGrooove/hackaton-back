import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose"
import { HydratedDocument, Document, Types } from "mongoose"
import { IChartData } from "../types/chartData"

export type DashboardsDocument = HydratedDocument<Dashboards>

@Schema({ collection: "Dashboards", versionKey: false })
export class Dashboards extends Document {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({
    type: [
      {
        id: Types.ObjectId,
        values: [{ time: Date, value: Number }],
      },
    ],
  })
  data: IChartData[]
}

export const DashboardsSchema = SchemaFactory.createForClass(Dashboards)
