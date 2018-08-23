// percent %;
const positions = {
  waiter:{
    toTable: [[60.3, 75]],
    toKitchen: [60.3, 10]
  },
  customer:{
    initial: [-10, 8],
    enter: [3.3, 8],
    toSeat: [[46.5, 88]],
    toExit: [100, 88],
    toLine: [[3.3, 88], [3.3, 76], [3.3, 64], [3.3, 52], [3.3, 40], [3.3, 28]]
  },
  chef:{
    toKitchen: [73, 10]
  }
}

const timeUnit = {
  customer: {
    enter: 0.5,
    toLine: [1.5, 1.25, 1, 0.75, 0.5, 0.25],
    toNext: 0.2,
    toSeat: [1],
    toExit: 1,
    order: 3,
    eat: 3
  },
  waiter: {
    toKitchen: 1.5,
    toTable: [1.5]
  },
  msgTime: 1
}

const words = {
  waiter: {
    greet: '欢迎光临!',
    checkout: '一共收您',
    served: '亲，这是您的'
  },
  chef: {
    remind: '做好了！'
  },
  customer: {
    chat: ['屏幕对面的你在干嘛？',
      '下班吃饭，单身狗日常。',
      '这家店的东西不错，但就是得排队！',
      '今天你那边下雨了吗？',
      '一一得一，一二得二，二二得三...',
      '排队真烦'
    ],
    order: ['我要',
      '我要吃',
      '我点'
    ]
  }
}

export {words, positions, timeUnit};