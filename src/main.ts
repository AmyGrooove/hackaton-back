import { NestFactory } from "@nestjs/core"
import { AppModule } from "./modules/app/app.module"
import cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const corsOptions = {
    origin: process.env.APP_URL,
    credentials: true,
  }

  app.use(cookieParser())
  app.enableCors(corsOptions)

  await app.listen(3000)
}

bootstrap()
