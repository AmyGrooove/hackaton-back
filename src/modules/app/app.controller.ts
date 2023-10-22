import { Controller, Get } from "@nestjs/common"
import * as fs from "fs"
import * as path from "path"

@Controller("")
export class AppController {
  constructor() {}

  @Get("")
  getUser() {
    const filePath = path.join("public/json.json")
    const rawData = fs.readFileSync(filePath, "utf8")
    return JSON.parse(rawData)
  }
}
