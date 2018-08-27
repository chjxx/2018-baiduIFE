var requireContext = require.context("../images", true, /^\.\/.*\.(png|jpg)$/);
requireContext.keys().map(requireContext);

// percent %;
const positions = {
  character: {
    waiter:{
      initial: [[44.5, 30], [54.5, 30], [64.5, 30]]
    },
    chef: {
      initial: [[54.2, 8], [67.2, 8], [80.2, 8]]
    },
    customer:{
      initial: [[-10, 8.875]]
    }
  },
  atEntrance: [4, 8.875],
  atKitchenOut: [[54.2, 20], [67.2, 20], [80.2, 20]],
  atTable: [[24.5, 69], [44.5, 69], [64.5, 69], [84.5, 69]],
  atSeat: [[24, 90], [44, 90], [64, 90], [84, 90]],
  atLine: [[4, 89], [4, 79], [4, 69], [4, 59], [4, 49], [4, 39], [4, 29], [4, 19]],
  outRestaurant: [100.7, 88.875]
}

const timeUnit = {
  customer: {
    order: 3,
    eat: 3
  },
  msgTime: 1.5
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
      '今天你那边下雨了吗？',
      '一一得一，一二得二，二二得三...'
    ],
    order: ['我要',
      '我要吃',
      '我点'
    ]
  }
};

const foodMenu = [
  {name: '鱼香肉丝', cost: 15, sale: 30},
  {name: '红烧排骨', cost: 25, sale: 50},
  {name: '宫保鸡丁', cost: 20, sale: 40},
  {name: '烧鸭', cost: 20, sale: 40},
  {name: '白切鸡', cost: 20, sale: 40},
  {name: '番茄炒鸡蛋', cost: 10, sale: 20},
  {name: '番茄鸡蛋汤', cost: 10, sale: 20},
  {name: '水煮鱼', cost: 25, sale: 50},
  {name: '清蒸金枪鱼', cost: 25, sale: 50},
  {name: '卤猪脚', cost: 20, sale: 40},
  {name: '苦瓜炒鸡蛋', cost: 10, sale: 20},
  {name: '炒芥兰', cost: 10, sale: 20},
  {name: '炒空心菜', cost: 10, sale: 20},
  {name: '香菇炒鸡肉', cost: 20, sale: 40},
  {name: '卤鸭', cost: 20, sale: 40},
  {name: '红萝卜炒肉', cost: 15, sale: 30},
  {name: '紫菜肉沫汤', cost: 15, sale: 30},
  {name: '红烧牛肉', cost: 25, sale: 50}
];

let customerImg = [
  './images/customer1.jpg',
  './images/customer2.jpg',
  './images/customer3.jpg',
  './images/customer4.jpg',
  './images/customer5.jpg',
  './images/customer6.jpg',
  './images/customer7.jpg',
  './images/customer8.jpg',
  './images/customer9.jpg',
  './images/customer10.jpg',
  './images/customer11.jpg',
  './images/customer12.jpg',
  './images/customer13.jpg',
  './images/customer14.jpg'
];

let waiterInfo = {
  name: 'Hinako',
  salary: 3000,
  avatarUrl: './images/waiter.png'
};

let chefInfo = {
  name: 'Alice',
  salary: 10000,
  avatarUrl: './images/chef.png'
};

export {words, positions, timeUnit, foodMenu, waiterInfo, chefInfo, customerImg};