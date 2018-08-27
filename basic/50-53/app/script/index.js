import {Restaurant, Food} from './restaurant.js';
import {getRandom} from './unit.js';
import {foodMenu} from './model.js';
import '../style/index.scss';

let restaurantInfo = {
  cash: 10000,
  seatAmount: 1,
  timeScale: 1000,
  elementId: '.container'
}

let restaurant = new Restaurant(restaurantInfo);

for(let i = 0; i < foodMenu.length; i++){
  let food = new Food(foodMenu[i])
}

foodMenu.forEach(info =>{
  let food = new Food(info);
  restaurant.menu.addFood(food);
});
