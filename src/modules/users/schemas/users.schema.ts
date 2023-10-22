import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose"
import { HydratedDocument, Document } from "mongoose"

export type UsersDocument = HydratedDocument<Users>

@Schema({ collection: "Users", versionKey: false })
export class Users extends Document {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop({ default: null })
  image: string | null

  @Prop({ default: "user" })
  role: string

  @Prop({
    type: [{ name: String, id: String }],
    default: [],
  })
  accessCharts: { name: string; id: string }[]

  @Prop({ default: null })
  refreshToken: string | null
}

export const UsersSchema = SchemaFactory.createForClass(Users)
