import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { ObjectId } from "mongoose"
import { UsersService } from "../users/users.service"
import { LoginUserDto } from "../users/dto/login-user.dto"
import { ConfigService } from "@nestjs/config"
import { usernameValidation } from "./types"
import { Response, Request } from "express"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getUser(req: Request) {
    const userId = req.cookies?.userId
    if (!userId) throw new BadRequestException("userId not exist")

    return this.usersService.findByIdLess(userId)
  }

  async register(data: CreateUserDto, res: Response) {
    if (!usernameValidation.test(data.username))
      throw new BadRequestException("Incorrect username")
    if (data.password.length < 4)
      throw new BadRequestException("The password is small")

    const userExists = await this.usersService.findByUsername(data.username)
    if (userExists) {
      throw new BadRequestException("User already exists")
    }

    const hash = await this.hashData(data.password)
    const newUser = await this.usersService.create({
      ...data,
      password: hash,
    })

    const tokens = await this.getTokens(newUser._id, newUser.username)
    await this.updateRefreshToken(newUser._id, tokens.refreshToken)

    res.cookie("accessToken", tokens.accessToken)
    res.cookie("refreshToken", tokens.refreshToken)
    res.cookie("userId", newUser._id)

    return true
  }

  async login(data: LoginUserDto, res: Response) {
    if (!usernameValidation.test(data.username))
      throw new BadRequestException("Incorrect username")
    if (data.password.length < 4)
      throw new BadRequestException("The password is small")

    const user = await this.usersService.findByUsername(data.username)
    if (!user) throw new BadRequestException("User does not exist")

    const fullUser = await this.usersService.findById(user._id)

    const passwordMatches = await bcrypt.compare(
      data.password,
      fullUser.password,
    )
    if (!passwordMatches) throw new BadRequestException("Password is incorrect")

    const tokens = await this.getTokens(fullUser._id, fullUser.username)
    await this.updateRefreshToken(fullUser._id, tokens.refreshToken)

    res.cookie("accessToken", tokens.accessToken)
    res.cookie("refreshToken", tokens.refreshToken)
    res.cookie("userId", fullUser._id)

    return true
  }

  async logout(res: Response, req: Request) {
    const userId = req.cookies?.userId
    if (!userId) throw new BadRequestException("userId not exist")

    const user = await this.usersService.findById(userId)

    if (user.refreshToken === null) throw new BadRequestException("Already out")

    this.usersService.update(user._id, { refreshToken: null })

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.clearCookie("userId")

    return true
  }

  async refreshTokens(res: Response, req: Request) {
    const userId = req.cookies?.userId
    const refreshToken = req.cookies?.refreshToken

    if (!userId) throw new BadRequestException("userId not exist")
    if (!refreshToken) throw new BadRequestException("refreshToken not exist")

    const user = await this.usersService.findById(userId)

    if (!user || !user.refreshToken)
      throw new ForbiddenException(
        "The user is not present or is not authorized",
      )

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    )

    if (!refreshTokenMatches)
      throw new ForbiddenException("Tokens do not match")

    const tokens = await this.getTokens(user._id, user.username)
    await this.updateRefreshToken(user._id, tokens.refreshToken)

    res.cookie("accessToken", tokens.accessToken)
    res.cookie("refreshToken", tokens.refreshToken)

    return true
  }

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10)
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken)
    await this.usersService.update(userId, { refreshToken: hashedRefreshToken })
  }

  async getTokens(userId: ObjectId, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id: String(userId), username },
        {
          secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
          expiresIn: "10m",
        },
      ),
      this.jwtService.signAsync(
        { id: String(userId), username },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: "1d",
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
