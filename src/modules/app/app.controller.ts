import { Controller, Get } from "@nestjs/common"

@Controller("")
export class AppController {
  constructor() {}

  @Get("")
  getUser() {
    return [
      {
        values: [
          {
            time: "2023-10-27T22:28:47.864Z",
            value: 78,
          },
          {
            time: "2023-11-01T22:28:47.864Z",
            value: 968,
          },
          {
            time: "2023-11-06T22:28:47.864Z",
            value: 680,
          },
          {
            time: "2023-11-11T22:28:47.864Z",
            value: 857,
          },
          {
            time: "2023-11-26T22:28:47.864Z",
            value: 295,
          },
          {
            time: "2023-12-31T22:28:47.864Z",
            value: 421,
          },
          {
            time: "2024-01-25T22:28:47.864Z",
            value: 149,
          },
          {
            time: "2024-02-14T22:28:47.864Z",
            value: 845,
          },
        ],
      },
      {
        values: [
          {
            time: "2023-11-16T22:28:47.864Z",
            value: 765,
          },
          {
            time: "2023-11-26T22:28:47.864Z",
            value: 692,
          },
          {
            time: "2023-12-11T22:28:47.864Z",
            value: 661,
          },
          {
            time: "2023-12-26T22:28:47.864Z",
            value: 210,
          },
          {
            time: "2023-12-26T22:28:47.864Z",
            value: 858,
          },
          {
            time: "2023-12-26T22:28:47.864Z",
            value: 336,
          },
          {
            time: "2024-01-25T22:28:47.864Z",
            value: 654,
          },
          {
            time: "2024-02-04T22:28:47.864Z",
            value: 79,
          },
          {
            time: "2024-02-09T22:28:47.864Z",
            value: 714,
          },
          {
            time: "2024-02-14T22:28:47.864Z",
            value: 761,
          },
        ],
      },
      {
        values: [
          {
            time: "2023-10-27T22:28:47.864Z",
            value: 747,
          },
          {
            time: "2023-12-31T22:28:47.864Z",
            value: 118,
          },
          {
            time: "2023-12-31T22:28:47.864Z",
            value: 969,
          },
          {
            time: "2024-01-15T22:28:47.864Z",
            value: 712,
          },
          {
            time: "2024-01-20T22:28:47.864Z",
            value: 727,
          },
          {
            time: "2024-02-24T22:28:47.864Z",
            value: 67,
          },
          {
            time: "2024-03-10T22:28:47.864Z",
            value: 420,
          },
        ],
      },
    ]
  }
}
