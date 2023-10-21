import { PartialType } from "@nestjs/swagger"
import { CreateUserDto } from "./create-user.dto"
import { ObjectId } from "mongoose"

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string
  image?: string
  accessCharts?: ObjectId[]
  refreshToken?: string
}
