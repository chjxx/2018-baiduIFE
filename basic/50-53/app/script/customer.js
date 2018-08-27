import {getRandom, getRandomID, copyObject} from './unit.js';
import {words} from './model.js';

class Customer{
  constructor(avatarUrl){
    this.id = getRandomID();
    this.ordered = [];
    this.taskStack = [];
    this.handler = {};
    this.avatarUrl = avatarUrl;
    this.state = 'waiting';
    this.type = 'customer';

    this.addTaskListener();
  }
  addTaskListener(){
    let customer = this;

    this.watch('queueup', async (restaurant)=>{
      await customer.queueUp(restaurant);
      customer.waiting();
      restaurant.emit('queueup');
      customer.do();
    });

    this.watch('toseat', async (idx)=>{
      await customer.toSeat(idx);
      customer.waiting();
      customer.restaurant.emit('sitin', customer);
      customer.do();
    });

    this.watch('order', async () =>{
      await customer.order();
      customer.waiting();
      customer.restaurant.emit('ordered', customer);
      customer.do();
    });

    this.watch('eat', async food=>{
      await customer.eat(food)
      customer.waiting();
      customer.restaurant.emit('eaten', customer);
      customer.do();
    });

    this.watch('leave', async ()=>{
      customer.leave();
      customer.restaurant.emit('left', customer);
    });
  }
  say(type, ...args){
    let $restaurantView = this.$restaurantView;
    let string, word, randomIdx;

    if(type === 'order'){
      word = words.customer.order;
    }else if(type === 'chat'){
      word = words.customer.chat;
    }

    randomIdx = getRandom(0, word.length - 1);

    string = word[randomIdx];

    if(args.length > 0){
      string += args.reduce((string, item) =>string += item, '');
    }

    if(string){
      $restaurantView.addWord(this.element, string);
    }
  }
  async queueUp(restaurant){
    let customer = this;
    customer.restaurant = restaurant;
    let $restaurantView = customer.$restaurantView = restaurant.$view;
    let queue = restaurant.queue;


    restaurant.queue.queueUp(customer);
    await $restaurantView.moveTo(customer, 'entrance');
    await $restaurantView.moveToQueue(customer, queue);

    let randomIdx = getRandom(0, queue.getLength());
    let randomCustomer = queue.getQueue()[randomIdx];

    if(customer){
      customer.say('chat');
    }
  }
  async toSeat(seatIndex){
    let customer = this;
    let $restaurantView = this.$restaurantView;
    let restaurant = customer.restaurant;

    customer.seatIndex = seatIndex;

    $restaurantView.updateQueue(restaurant.queue);
    await $restaurantView.moveTo(customer, 'queuehead');
    await $restaurantView.moveTo(customer, 'seat', seatIndex);
  }
  leave(){
    let customer = this;
    let $restaurantView = customer.$restaurantView;
    let restaurant = customer.restaurant;
    let idx = restaurant.seats.getCustomerSeatIndex(customer);

    restaurant.seats.leave(idx);
    $restaurantView.removeOrderedList(idx);
    $restaurantView.moveTo(customer, 'outrestaurant').then(()=>{
      $restaurantView.removeCharacter(customer);
    });
  }
  async order(){
    let customer = this;
    let $restaurantView = this.$restaurantView;
    let menu = customer.restaurant.menu.getMenu();
    let randomNum = getRandom(1, 4);

    for(let i = 0; i < randomNum; i++){
      let randomIdx = getRandom(0, menu.length - 1);
      let orderedFood = menu[randomIdx];

      let sameOrdered = customer.ordered.some(food=> food.name === orderedFood.name);

      if(!sameOrdered){
        let copyFood = copyObject(orderedFood);

        copyFood.customer = customer;
        customer.ordered.push(copyFood);
      }else{
        i -= 1; //这次选菜不算数
      }
    }

    await $restaurantView.orderFood(customer);

    let foodNames = customer.ordered.map(food=> food.name);

    customer.say('order', foodNames.join('，'));
    $restaurantView.updateOrdered(customer.ordered, customer.seatIndex);

    return;
  }
  async eat(food){
    let customer = this;
    let $restaurantView = this.$restaurantView;

    await $restaurantView.eating(customer, food);
    food.eated();
    $restaurantView.updateOrdered(customer.ordered, customer.seatIndex);

    return;
  }
  working(){
    this.state = 'working';
  }
  waiting(){
    this.state = 'waiting';
  }
  addTask(type, args){
    this.taskStack.push([type, args]);
    this.do();
  }
  do(){
    let customer = this;

    if(customer.state === 'waiting' && customer.taskStack.length > 0){
      customer.working();

      let [type, args] = customer.taskStack.shift();

      this.emit(type, args);
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
}

export {Customer};