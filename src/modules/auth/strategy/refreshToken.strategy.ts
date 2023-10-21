import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { JwtPayload } from "../types"
import { Request as RequestType } from "express"

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor() {
    super({
      jwtFromRequest: RefreshTokenStrategy.extractJWT,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    })
  }

  private static extractJWT(req: RequestType): string | null {
    if (req.cookies.refreshToken) return req.cookies.refreshToken
    else return null
  }

  validate(req: RequestType, payload: JwtPayload) {
    return { ...payload, refreshToken: req.cookies.refreshToken }
  }
}
