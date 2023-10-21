import { Controller, UseGuards, Get, Req } from "@nestjs/common"
import { AccessTokenGuard } from "../auth/guards/accessToken.guard"
import { Request } from "express"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get("whoami")
  getUser(@Req() req: Request) {
    return this.usersService.getUser(req)
  }
}
