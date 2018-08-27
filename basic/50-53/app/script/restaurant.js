'use strict'
import View from './view.js';
import {Waiter, Chef} from './staff.js';
import {Customer} from './customer.js';
import {getRandom, getRandomID} from './unit.js';
import {timeUnit, positions, waiterInfo, chefInfo, customerImg} from './model.js';

const [INITIAL, START, CLOSE] = [0, 1, 2];
let $view;

class Restaurant{
  constructor({cash = 0, timeScale = 1000, elementId}){
    this.$view = $view = new View(elementId, this, timeScale);
    this.handler = {};
    this.taskStack = {};
    this.timeScale = timeScale;
    this.state = INITIAL;

    this.cash = initialCash(cash);

    this.queue = initialQueue(positions.atLine.length);

    this.menu = initialMenu();

    this.staff = initialStaff(this, positions.character);

    this.seats = initialSeat(positions.atSeat.length);

    this.addListener();

    this.emit('becreated', this);
  }
  addTask(type, ...args){
    let self = this;

    if(type === 'cook'){
      if(!this.taskStack.chef){
        this.taskStack.chef = [];
      }
      args[0].forEach(needcooked=>{
        self.taskStack.chef.push([type, needcooked]);
      });
      this.emit('addcheftask');
    }else{
      if(!this.taskStack.waiter){
        this.taskStack.waiter = [];
      }
      this.taskStack.waiter.push([type, ...args]);
      this.emit('addwaitertask');
    }
  }
  addListener(){
    let restaurant = this;

    this.watch('open', ()=>{
      let idx = 0;
      let time = getRandom(2000, 4000);

      setInterval(()=>{
        idx += 1;
        idx = idx % customerImg.length;

        let customer = new Customer(customerImg[idx]);

        restaurant.addCustomer(customer);

      }, time);
    });

    this.watch('queueup',async ()=>{
      this.emit('checkemptyseat');
    });

    this.watch('checkemptyseat', ()=>{
      if(restaurant.seats.hasEmpty()){
        if(restaurant.queue.getLength() > 0){
          let customer = restaurant.queue.dequeue();
          let idx = restaurant.seats.getEmptySeatIndex();

          restaurant.seats.sit(idx, customer);
          customer.addTask('toseat', idx);
        }
      }
    });

    this.watch('sitin', customer =>{
      customer.addTask('order');
      restaurant.addTask('greet', customer);
    })

    this.watch('ordered', customer =>{
      restaurant.addTask('cook', customer.ordered);
    });

    this.watch('cooked', (cookedFood, kitchenIndex)=>{
      restaurant.addTask('serve', cookedFood, kitchenIndex);
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
      restaurant.emit('checkemptyseat');
    })
  }
  addCustomer(customer){
    let restaurant = this;

    $view.addCharacter(customer);

    customer.addTask('queueup', restaurant);
  }
  createEmployee(type){
    let employee;

    if(type === 'waiter'){
      employee = new Waiter(waiterInfo);
    }else if(type === 'chef'){
      employee = new Chef(chefInfo);
    }

    return employee;
  }
  hire(person){
    this.staff.hire(person);
  }
  fire(person){
    this.staff.fire(person);
  }
  start(){
    let chef = this.staff.hasTypeEmployee('chef');
    let waiter = this.staff.hasTypeEmployee('waiter');
    let foods = this.menu.getMenu();

    if(!chef){
      alert('还没有雇用厨师！')
    }else if(!waiter){
      alert('还没有雇用服务员！')
    }else if(foods.length === 0){
      return new Error("The restaurant did not have food menu!")
    }else{
      if(this.state !== START){
        this.state = START;
        this.$view.changeRestaurantState('opening');
        this.emit('open');
      }
    }
  }
  watch(type, fn){
    if(!this.handler[type]){
      this.handler[type] = [];
    }

    this.handler[type].push(fn);
  }
  emit(type, ...args){
    if(this.handler[type]){
      this.handler[type].forEach(fn => fn(...args));
    }
  }
  detach(type, detachFn){
    if(this.handler[type]){
      let index = this.handler[type].indexOf(detachFn);

      if(index !== -1){
        this.handler[type].splice(index, 1);
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
        return true;
      }else{
        return false;
      }
    },
    getQueueIndex(customer){
      return queue.indexOf(customer);
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

function initialStaff(restaurant, characterPosition){
  let staff = {};
  let type = Object.keys(characterPosition);


  return{
    hire: (person) =>{
      let typeIdx;

      if(person){
        typeIdx = type.indexOf(person.type);
      }

      if(typeIdx !== -1){
        let employeeType = type[typeIdx];

        if(!staff[employeeType]){
          staff[employeeType] = [];
        }

        let maxLength = characterPosition[employeeType].initial.length;

        if(staff[employeeType].length < maxLength){
          let length = staff[employeeType].push(person);
          let employeeIdx = length - 1;

          person.entry(restaurant, employeeIdx);

          $view.updateEmployeelist();
          return true;
        }else{
          alert('该类型雇员已到达最大数量，无法继续添加！')
        }
      }else{
        return new Error('The restaurant do not offer this kind of occupation!');
      }
    },
    fire: (person) =>{
      let typeIdx, typeEmployees;

      if(person){
        typeIdx = type.indexOf(person.type);
      }

      typeEmployees = staff[person.type];

      if(typeIdx !== -1 && typeEmployees){
        let idx = typeEmployees.indexOf(person);

        if(idx !== -1){
          if(typeEmployees.length === 1){
            alert('该类型雇员已经减少到最小数，无法解雇！')
          }else{
            typeEmployees.splice(idx, 1);
            person.quit();
            $view.updateEmployeelist();
          }
        }else{
          error();
        }
      }else{
        error();
      }

      function error(){
        return new Error('The restaurant did not hire this employee!')
      }
    },
    getTypeEmployeeIndex: (person)=>{
      let typeStaff = staff[person.type];

      if(Array.isArray(typeStaff)){
        return typeStaff.indexOf(person);
      }else{
        return -1;
      }
    },
    hasTypeEmployee: (type) =>{
      if(staff[type]){
        if(staff[type].length > 0){
          return true;
        }
      }
    },
    getAllEmployees: ()=>{
      let allStaff = [];

      for(let key in staff){
        if(staff.hasOwnProperty(key)){
          allStaff = staff[key].concat(allStaff);
        }
      }

      return allStaff;
    },
    findTypeEmployee: (type, id)=>{
      if(staff[type]){
        let employee = staff[type].find(employee=> employee.id === id);

        if(employee){
          return employee;
        }
      }
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
    hasEmpty(){
      let idx = seats.indexOf(null);

      return idx !== -1 ? true : false;
    },
    getEmptySeatIndex(){
      return seats.indexOf(null);
    },
    getCustomerSeatIndex: (customer)=>{
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
    this.kitchenIndex;
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