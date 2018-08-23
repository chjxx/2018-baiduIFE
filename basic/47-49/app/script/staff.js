import {getRandomID} from './unit.js';
import {words} from './model.js';

class Staff{
  constructor({name, salary, avatarUrl}){
    this.name = name;
    this.salary = salary;
    this.avatarUrl = avatarUrl;
    this.taskStack = [];
    this.state = 'waiting';
  }
  entry(restaurant){
    this.restaurant = restaurant;
    this.$restaurantView = restaurant.$view;
  }
  quit(){
    this.restaurant = null;
    this.$restaurantView = null;
  }
  waiting(){
    this.state = 'waiting';
  }
  working(){
    this.state = 'working';
  }
  addTask(type, ...args){
    if(type === 'cook' && Array.isArray(args[0])){
      args[0].forEach(food =>{
        this.taskStack.push([type, [food]]);
      });
    }else{
      this.taskStack.push([type, args]);
    }

    this.do();
  }
  do(){

  }
}

class Waiter extends Staff{
  constructor(info){
    super(info);
    this.id = getRandomID();
    this.position = 'table0';
  }
  say(type, ...args){
    let $restaurantView = this.$restaurantView;
    let string;

    if(type === 'greet'){
      string = words.waiter.greet;
    }else if(type === 'served'){
      string = words.waiter.served + args[0];
    }else if(type === 'getmoney'){
      string = words.waiter.checkout + args[0];
    }

    if(string){
      $restaurantView.addWord(this.element, string);
    }
  }
  deliverMenu(customer){
    let waiter = this;
    let restaurant = waiter.restaurant;
    let $restaurantView = waiter.$restaurantView;
    let idx = restaurant.seats.getTableIndex(customer);

    return $restaurantView.moveToTable(waiter, idx)
      .then(()=>{
        return $restaurantView.moveToKitchen(waiter)
          .then(()=>{
            restaurant.emit('delivered', customer.ordered);

            return $restaurantView.moveToTable(waiter, idx);
          });
      });
  }
  serveFood(food){
    let waiter = this;
    let restaurant = waiter.restaurant;
    let customer = food.customer;
    let $restaurantView = waiter.$restaurantView;

    return $restaurantView.moveToKitchen(waiter)
      .then(()=>{
        let idx = restaurant.seats.getTableIndex(customer);

        return $restaurantView.moveToTable(waiter, idx)
          .then(()=>{
            food.served();
            $restaurantView.updataOrdered(customer.ordered);
            return food;
          });
      });
  }
  checkout(customer){
    let restaurant = this.restaurant;
    let sum = customer.ordered.reduce((sum, food)=>{
      sum += food.sale;
      return sum;
    }, 0);

    this.say('getmoney', sum);

    restaurant.cash.increase(sum);
  }
  do(){
    let waiter = this;
    let restaurant = waiter.restaurant;

    if(waiter.state === 'waiting' && waiter.taskStack.length > 0){
      waiter.working();
      let [type, args] = waiter.taskStack.shift();

      if(type === 'greet'){
        waiter.say(type);
        waiter.waiting();
        waiter.do();
      }else if(type === 'delivermenu'){
        waiter.deliverMenu(...args)
          .then(()=>{
            waiter.waiting();
            waiter.do();
          });
      }else if(type === 'serve'){
        waiter.serveFood(...args)
          .then(food =>{
            waiter.say('served', food.name);
            waiter.waiting();
            restaurant.emit('served', food);
            waiter.do();
          })
      }else if(type === 'checkout'){
        waiter.checkout(...args);
        waiter.waiting();
        restaurant.emit('checkout', ...args);
        waiter.do();
      }
    }
  }
}

class Chef extends Staff{
  constructor(info){
    super(info);
    this.id = getRandomID();
  }
  cook(food){
    let chef = this;
    let $restaurantView = chef.$restaurantView;

    let foods = chef.taskStack.reduce((foods, task) =>{
      if(task[0] === 'cook'){
        foods.push(task[1][0]);
      }
      return foods;
    }, []);


    $restaurantView.updateCookList(foods);

    return $restaurantView.updateCookState(food)
      .then(()=>{
        let string = food.name + words.chef.remind;
        $restaurantView.addWord(chef.element, string);

        return food;
      });
  }
  do(){
    let chef = this;
    let restaurant = chef.restaurant;

    if(chef.state === 'waiting' && chef.taskStack.length > 0){
      chef.working();
      let [type, args] = chef.taskStack.shift();

      if(type === 'cook'){
        chef.cook(...args)
          .then((food)=>{
            chef.waiting();
            chef.$restaurantView.initialCookState();
            restaurant.emit('cooked', food);
            chef.do();
          });
      }
    }
  }
}

export {Waiter, Chef};