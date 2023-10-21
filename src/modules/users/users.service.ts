import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, ObjectId } from "mongoose"
import { CreateUserDto } from "./dto/create-user.dto"
import { Users } from "./schemas/users.schema"
import { UpdateUserDto } from "./dto/update-user.dto"
import { FindByUsername } from "./types"
import { Request } from "express"

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  async getUser(req: Request) {
    const userId = req.cookies?.userId
    if (!userId) throw new BadRequestException("userId not exist")

    return this.findByIdLess(userId)
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const createdUser = new this.usersModel(createUserDto)
    return createdUser.save()
  }

  async update(
    id: string | ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersModel.findByIdAndUpdate(id, updateUserDto).exec()
  }

  async findById(id: string | ObjectId): Promise<Users> {
    return this.usersModel.findById(id).lean().exec()
  }

  async findByIdLess(id: string | ObjectId): Promise<Users> {
    return this.usersModel
      .findById(id)
      .select({ _id: 1, username: 1, image: 1, role: 1, accessCharts: 1 })
      .lean()
      .exec()
  }

  async findByUsername(username: string): Promise<FindByUsername> {
    return this.usersModel
      .findOne({ username })
      .select({ _id: 1, username: 1, image: 1, role: 1, accessCharts: 1 })
      .lean()
      .exec()
  }

  async findByRefresh(refreshToken: string): Promise<Users> {
    return this.usersModel.findOne({ refreshToken }).lean().exec()
  }
}
