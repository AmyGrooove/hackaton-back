import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"
import { JwtPayload } from "../types"
import { Request as RequestType } from "express"

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: AccessTokenStrategy.extractJWT,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    })
  }

  private static extractJWT(req: RequestType): string | null {
    if (req.cookies.accessToken) return req.cookies.accessToken
    else return null
  }

  validate(payload: JwtPayload) {
    return payload
  }
}
