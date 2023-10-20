import { Injectable } from "@nestjs/common"

const randomNumber = (max: number) => Math.floor(Math.random() * max)

const getRandomDate = (baseDate: Date, count: number): Date =>
  new Date(baseDate.getTime() + (count * 5 + 1) * 24 * 60 * 60 * 1000)

@Injectable()
export class ChartDataService {
  generateChart(count = 5) {
    return new Array(count).fill({
      id: randomNumber(1000),
      values: new Array(randomNumber(50))
        .fill(0)
        .map(() => ({
          time: getRandomDate(new Date(), randomNumber(30)),
          value: randomNumber(1000),
        }))
        .sort((a, b) => a.time.getTime() - b.time.getTime()),
    })
  }
}
