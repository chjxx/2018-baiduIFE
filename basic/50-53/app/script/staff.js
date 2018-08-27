import {getRandomID} from './unit.js';
import {words} from './model.js';

class Staff{
  constructor({name, salary, avatarUrl}){
    this.name = name;
    this.salary = salary;
    this.avatarUrl = avatarUrl;
    this.handler = {};
    this.state = 'initial';
    this.befired = false;
  }
  quit(){
    if(this.state === 'waiting'){
      this.$restaurantView.removeCharacter(this);
      this.restaurant.detach(`add${this.type}task`, this.restaurantLinsten);
      this.$restaurantView = null;
      this.restaurant = null;
      this.handler = {};
    }else{
      this.befired = true;
    }
  }
  waiting(){
    this.state = 'waiting';
  }
  working(){
    this.state = 'working';
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
}

class Waiter extends Staff{
  constructor(info){
    super(info);
    this.id = getRandomID();
    this.type = 'waiter';
  }
  entry(restaurant, employeeIndex){
    this.restaurant = restaurant;
    this.$restaurantView = restaurant.$view;
    this.$restaurantView.addCharacter(this, employeeIndex);
    this.waiting();
    this.addTaskListener();
    this.emit('checktask');
  }
  isWorker(type){
    let execute = this.handler[type];

    return execute ? true : false;
  }
  addTaskListener(){
    let self = this;
    let restaurant = this.restaurant;

    this.restaurantLinsten = function(){
      if(self.state === 'waiting'){
        self.emit('checktask');
      }
    };

    restaurant.watch('addwaitertask', this.restaurantLinsten);

    this.watch('checktask', async ()=>{
      if(restaurant.taskStack.waiter && restaurant.taskStack.waiter.length > 0){
        let [type, ...args] = restaurant.taskStack.waiter.shift();
        self.emit(type, ...args);
      }else{
        self.working();
        let index = self.restaurant.staff.getTypeEmployeeIndex(self);

        await self.$restaurantView.moveTo(self, 'initial', index);
        self.waiting();
      }
    });

    this.watch('serve', async (food)=>{
      self.working();
      await self.serveFood(food);
      self.say('served', food.name);
      self.waiting();
      restaurant.emit('served', food);
      self.emit('checktask');
    });

    this.watch('checkout',async (customer)=>{
      self.working();
      await self.checkout(customer);
      self.waiting();
      if(self.befired){
        self.quit();
      }else{
        self.emit('checktask');
      }

      restaurant.emit('checkout', customer);
    });
  }
  say(type, ...args){
    let $restaurantView = this.$restaurantView;
    let string;

    if(type === 'greet'){
      string = words.waiter.greet;
    }else if(type === 'served'){
      string = words.waiter.served;
    }else if(type === 'getmoney'){
      string = words.waiter.checkout;
    }

    if(args.length > 0){
      string += args.reduce((string, item)=>string += item, '');
    }

    if(string){
      $restaurantView.addWord(this.element, string);
    }
  }
  async toTable(tableIndex){
    let $restaurantView = this.$restaurantView;

    await $restaurantView.moveTo(this, 'table', tableIndex);
  }
  async toKitchen(kitchenIndex = 0){
    let $restaurantView = this.$restaurantView;

    await $restaurantView.moveTo(this, 'kitchenout', kitchenIndex);
  }
  async serveFood(food){
    let waiter = this;
    let kitchenIndex = food.kitchenIndex;
    let restaurant = waiter.restaurant;
    let customer = food.customer;
    let $restaurantView = waiter.$restaurantView;
    let tableIndex = customer.seatIndex;

    await this.toKitchen(kitchenIndex);
    await this.toTable(tableIndex);
    food.served();
    waiter.$restaurantView.updateOrdered(customer.ordered, tableIndex);
    return;
  }
  async checkout(customer){
    let restaurant = this.restaurant;
    await this.toTable(customer.seatIndex);
    let sum = customer.ordered.reduce((sum, food)=>{
      sum += food.sale;
      return sum;
    }, 0);

    restaurant.$view.updateTableState(customer.seatIndex, 'checkout');

    this.say('getmoney', sum);

    await new Promise((resolve, reject)=>{
      setTimeout(()=>{
        restaurant.$view.updateTableState(customer.seatIndex, 'initial');
        resolve();
      }, 1000);
    });

    restaurant.cash.increase(sum);
  }
}

class Chef extends Staff{
  constructor(info){
    super(info);
    this.id = getRandomID();
    this.type = 'chef';

  }
  entry(restaurant, employeeIndex){
    this.restaurant = restaurant;
    this.$restaurantView = restaurant.$view;
    this.$restaurantView.addCharacter(this, employeeIndex);
    this.$restaurantView.initialCookState(employeeIndex);
    this.waiting();
    this.addTaskListener();
    this.emit('checktask');
  }
  isWorker(type){
    let execute = this.handler[type];

    return execute ? true : false;
  }
  addTaskListener(){
    let self = this;
    let restaurant = this.restaurant;

    this.restaurantLinsten = function(){
      if(self.state === 'waiting'){
        self.emit('checktask');
      }
    };

    restaurant.watch('addcheftask', this.restaurantLinsten);

    this.watch('checktask', ()=>{
      if(restaurant.taskStack.chef && restaurant.taskStack.chef.length > 0){
        let [type, ...args] = restaurant.taskStack.chef.shift();

        self.emit(type, ...args);
      }
    })

    this.watch('cook', async (food)=>{
      self.working();

      let chefIndex = await self.cook(food);
      let restaurant = self.restaurant;

      self.say('remind', food.name);
      self.waiting();
      if(self.befired){
        self.quit();
      }else{
        self.emit('checktask');
      }

      restaurant.emit('cooked', food, chefIndex);
    });
  }
  say(type, ...args){
    let string;

    if(type === 'remind'){
      string = args[0] + words.chef.remind;
    }

    if(string){
      this.$restaurantView.addWord(this.element, string);
    }
  }
  async cook(food){
    let chefTask = this.restaurant.taskStack.chef;
    let $restaurantView = this.$restaurantView;
    let chefIndex = this.restaurant.staff.getTypeEmployeeIndex(this);

    let foods = chefTask.reduce((foods, task) =>{
      if(task[0] === 'cook'){
        foods.push(task[1]);
      }
      return foods;
    }, []);

    $restaurantView.updateCookList(foods);

    food.kitchenIndex = chefIndex;
    await $restaurantView.moveTo(this, 'initial', chefIndex);
    await $restaurantView.updateCookState(chefIndex, food);
    $restaurantView.initialCookState(chefIndex);

    return chefIndex;
  }
}

export {Waiter, Chef};