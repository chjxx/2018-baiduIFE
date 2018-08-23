import {Restaurant, Food, Waiter, Chef, Customer} from './restaurant.js';
import {getRandom} from './unit.js';
import '../style/index.scss';

var requireContext = require.context("../images", true, /^\.\/.*\.(png|jpg)$/);
requireContext.keys().map(requireContext);

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
  '../images/customer1.jpg',
  '../images/customer2.jpg',
  '../images/customer3.jpg',
  '../images/customer4.jpg',
  '../images/customer5.jpg',
  '../images/customer6.jpg',
  '../images/customer7.jpg',
  '../images/customer8.jpg',
  '../images/customer9.jpg',
  '../images/customer10.jpg',
  '../images/customer11.jpg',
  '../images/customer12.jpg',
  '../images/customer13.jpg',
  '../images/customer14.jpg'
];

let waiterInfo = {
  name: 'Hinako',
  salary: 3000,
  avatarUrl: '../images/waiter.png'
};

let chefInfo = {
  name: 'Alice',
  salary: 10000,
  avatarUrl: '../images/chef.png'
};

let restaurantInfo = {
  cash: 10000,
  seatAmount: 1,
  timeScale: 1000,
  elementId: '.container'
}

let restaurant = new Restaurant(restaurantInfo);

let waiter = new Waiter(waiterInfo);
let chef = new Chef(chefInfo);

for(let i = 0; i < foodMenu.length; i++){
  let food = new Food(foodMenu[i])
}

foodMenu.forEach(info =>{
  let food = new Food(info);
  restaurant.menu.addFood(food);
});


restaurant.staff.hire(chef);

restaurant.staff.hire(waiter);

restaurant.start();

let time,idx = 0;

time = getRandom(1000, 8000);

let timer = setInterval(()=>{
  idx = idx % customerImg.length;
  let customer = new Customer(customerImg[idx]);
  restaurant.addCustomer(customer);
  idx += 1;
  time = getRandom(1000, 8000);
}, time);



