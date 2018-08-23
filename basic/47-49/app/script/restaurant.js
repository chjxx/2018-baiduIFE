'use strict'
import View from './view.js';
import {Waiter, Chef} from './staff.js';
import {Customer} from './customer.js';
import {getRandom, getRandomID} from './unit.js';
import {timeUnit} from './model.js';

const [INITIAL, START, CLOSE] = [0, 1, 2];
let $view;

class Restaurant{
  constructor({cash, seatAmount, timeScale, elementId}){
    this.$view = $view = new View(elementId, timeScale);
    this.handler = [];
    this.timeScale = timeScale;
    this.state = INITIAL;

    this.cash = initialCash(cash);

    this.queue = initialQueue(6);

    this.menu = initialMenu();

    this.staff = initialSimpleStructure(this);

    this.seats = initialSeat(seatAmount);

    this.addListener();

    this.emit('becreated', this);
  }
  addTask(type, ...args){
    let waiter = this.staff.getWaiter();
    let chef = this.staff.getChef();

    if(type === 'greet'){
      waiter.addTask(type, ...args);
    }else if(type === 'delivermenu'){
      waiter.addTask(type, ...args);
    }else if(type === 'cook'){
      chef.addTask(type, ...args);
    }else if(type === 'serve'){
      waiter.addTask(type, ...args);
    }else if(type === 'checkout'){
      waiter.addTask(type, ...args);
    }
  }
  addListener(){
    let restaurant = this;

    this.watch('queueup', ()=>{
      let idx = restaurant.seats.getEmptySeatIndex();
      if(idx !== -1){
        this.emit('hasemptyseat', idx);
      }
    })

    this.watch('hasemptyseat', (idx)=>{

      if(restaurant.queue.getLength() > 0){
        let customer = restaurant.queue.dequeue();
        let idx = restaurant.seats.getEmptySeatIndex();
        restaurant.seats.sit(idx, customer);

        customer.addTask('toseat', idx);
      }
    });

    this.watch('sitin', customer =>{
      customer.addTask('order');
      restaurant.addTask('greet');
    })

    this.watch('ordered', customer =>{
      restaurant.addTask('delivermenu', customer);
    });

    this.watch('delivered', (needCookedMenu)=>{
      restaurant.addTask('cook', needCookedMenu);
    });

    this.watch('cooked', (cookedFood)=>{
      restaurant.addTask('serve', cookedFood);
    });

    this.watch('served', food =>{
      let customer = food.customer;

      customer.addTask('eat', food)
    });
    this.watch('eaten', customer =>{
      let orderedFoods = customer.ordered;
      let servedFood = orderedFoods.find(food=> food.state === 'served');
      let servingFood = orderedFoods.find(food=> food.state === 'serving');

      if(!servedFood && !servingFood){
        restaurant.emit('eatenfoods', customer);
      }
    });

    this.watch('eatenfoods', customer =>{
      restaurant.addTask('checkout', customer);
    });

    this.watch('checkout', customer =>{
      customer.addTask('leave');
    });

    this.watch('left', customer =>{
      let idx = restaurant.seats.getEmptySeatIndex();
      if(idx !== -1){
        restaurant.emit('hasemptyseat', idx);
      }
    })
  }
  addCustomer(customer){
    let restaurant = this;

    $view.addCustomer(customer);

    customer.addTask('queueup', restaurant);
  }
  watch(type, fn){
    if(!this.handler[type]){
      this.handler[type] = [];
    }

    this.handler[type].push(fn);
  }
  emit(type, restaurant){
    if(this.handler[type]){
      this.handler[type].forEach(fn => fn(restaurant));
    }
  }
  start(){
    let chef = this.staff.getChef();
    let waiter = this.staff.getWaiter();
    let foods = this.menu.getMenu();

    if(!chef){
      return new Error("The restaurant did not hire the chef!");
    }else if(!waiter){
      return new Error("The restaurant did not hire the waiter!");
    }else if(foods.length === 0){
      return new Error("The restaurant did not have food menu!")
    }else if(this.state === START){
      return;
    }else{
      this.state = START;
      if(this.seats.getEmptySeatIndex() !== -1){
        this.emit('hasemptyseat');
      }
    }
  }
}

function initialCash(cash){
  $view.setCash(cash);

  return {
    getBalance: () =>{
      return cash;
    },
    increase: (count) =>{
      if(typeof count === 'number'){
        cash += count;
        $view.setCash(cash);
        return cash;
      }
    },
    decrease: (count) =>{
      if(typeof count === 'number'){
        cash -= count;
        $view.setCash(cash);
        return cash;
      }
    }
  }
}

function initialQueue(count){
  let queue = Array.from({length: count}).map(item => item = null);

  return {
    queueUp: (person)=>{
      let idx = queue.indexOf(null);
      if(idx !== -1){
        queue[idx] = person;
        return idx;
      }
      return idx;
    },
    dequeue: ()=>{
      let customer = queue.shift();
      queue[queue.length] = null; // 加一个位置

      return customer;
    },
    getLength: ()=>{
      return queue.filter(customer => customer !== null).length;
    },
    getQueue: ()=>{
      return queue;
    }
  }
}

function initialMenu(){
  let menu = [];

  return {
    addFood(arg){
      if(arg.constructor === Food){
        menu.push(arg);
      }
    },
    getMenu(){
      return menu.concat();
    }
  }
}

function initialSimpleStructure(restaurant){
  let staff = [];

  return{
    hire: person =>{
      let sameProfessionEmployee;

      if(staff.length > 0){
        sameProfessionEmployee = staff.find(employee => employee.constructor === person.constructor);
      }
      if(!sameProfessionEmployee){
        person.entry(restaurant);
        staff.push(person);
        if(person.constructor === Waiter){
          $view.addWaiter(person);
        }else if(person.constructor === Chef){
          $view.addChef(person);
        }
      }
    },
    fire: person =>{
      if(staff.length > 0){
        staff.forEach((employee, idx) =>{
          if(employee === person){
            person.quit();
            staff.splice(idx, 1);
          }
        });
      }
    },
    getStaff: ()=>{
      return staff.concat();
    },
    getChef: ()=>{
      return staff.find(employee => employee.constructor === Chef);
    },
    getWaiter: ()=>{
      return staff.find(employee => employee.constructor === Waiter);
    }
  }
}

function initialSeat(seatAmount){
  let seats = Array.from({length: seatAmount}).map(item => item = null);

  return{
    sit: (idx, customer) =>{
      seats[idx] = customer;
    },
    leave: idx =>{
      seats[idx] = null;
    },
    getEmptySeatIndex(){
      return seats.indexOf(null);
    },
    getTableIndex: (customer)=>{
      return seats.indexOf(customer);
    }
  }
}

class Food{
  constructor({name, cost, sale, time}){

    this.name = name;
    this.cost = cost;
    this.sale = sale;
    this.cookTime = getRandom(1, 10);
    this.customer;
    this.state = 'serving';
  }
  serving(){
    this.state = 'serving';
  }
  served(){
    this.state = 'served';
  }
  eated(){
    this.state = 'eated';
  }
}

export {Restaurant, Food, Waiter, Chef, Customer}