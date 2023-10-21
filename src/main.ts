import { NestFactory } from "@nestjs/core"

import { AppModule } from "./modules/app/app.module"
import cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.enableCors()
  await app.listen(3000)
}

bootstrap()
