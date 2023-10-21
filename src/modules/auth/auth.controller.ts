import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Res,
  Req,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { LoginUserDto } from "../users/dto/login-user.dto"
import { AccessTokenGuard } from "./guards/accessToken.guard"
import { RefreshTokenGuard } from "./guards/refreshToken.guard"
import { Response, Request } from "express"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.register(createUserDto, res)
  }

  @Post("login")
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
    return this.authService.login(loginUserDto, res)
  }

  @UseGuards(AccessTokenGuard)
  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.logout(res, req)
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  refreshTokens(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return this.authService.refreshTokens(res, req)
  }

  @UseGuards(AccessTokenGuard)
  @Get("whoami")
  getUser(@Req() req: Request) {
    return this.authService.getUser(req)
  }
}
