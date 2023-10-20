import { Injectable } from "@nestjs/common"

const randomNumber = (max: number) => Math.floor(Math.random() * max)

const getRandomDate = (baseDate: Date): Date =>
  new Date(baseDate.getTime() + (Math.random() * 5 + 1) * 24 * 60 * 60 * 1000)

@Injectable()
export class ChartDataService {
  generateChart(count = 5) {
    return new Array(count).fill({
      id: randomNumber(1000),
      values: new Array(randomNumber(30)).fill(0).map(() => ({
        time: getRandomDate(new Date()),
        value: randomNumber(1000),
      })),
    })
  }
}
