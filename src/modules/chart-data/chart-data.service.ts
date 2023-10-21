import { Injectable } from "@nestjs/common"

interface IChartData {
  id: number
  values?: { time: Date; value: number }[]
}

const randomNumber = (max: number) => Math.floor(Math.random() * max)

const getRandomDate = (baseDate: Date, count: number): Date =>
  new Date(baseDate.getTime() + (count * 5 + 1) * 24 * 60 * 60 * 1000)

@Injectable()
export class ChartDataService {
  generateChart(count = 5) {
    const chartData: IChartData[] = new Array(count).fill(0).map(() => ({
      id: randomNumber(1000),
    }))

    chartData.forEach((el, index) => {
      chartData[index] = {
        ...el,
        values: new Array(randomNumber(50))
          .fill(0)
          .map(() => ({
            time: getRandomDate(new Date(), randomNumber(30)),
            value: randomNumber(1000),
          }))
          .sort((a, b) => a.time.getTime() - b.time.getTime()),
      }
    })

    return chartData
  }
}
