import {getRandom, getRandomID} from './unit.js';
import {words} from './model.js';

class Customer{
  constructor(avatarUrl){
    this.id = getRandomID();
    this.ordered = [];
    this.taskStack = [];
    this.avatarUrl = avatarUrl;
    this.state = 'waiting';
  }
  say(type, ...args){
    let $restaurantView = this.$restaurantView;
    let string;

    if(type === 'order'){
      let word = words.customer.order;
      let randomIdx = getRandom(0, word.length - 1);
      if(word[randomIdx]){
        string = word[randomIdx] + args[0];
      }
    }else if(type === 'chat'){
      let word = words.customer.chat;
      let randomIdx = getRandom(0, word.length - 1);

      string = word[randomIdx];
    }

    if(string){
      $restaurantView.addWord(this.element, string);
    }
  }
  randomSpeak(){
    let queue = this.restaurant.queue;
    let randomIdx = getRandom(0, queue.getLength());
    let customer = queue.getQueue()[randomIdx];
    if(customer){
      customer.say('chat');
    }
  }
  queueUp(restaurant){
    let customer = this;
    this.restaurant = restaurant;
    let $restaurantView = this.$restaurantView = restaurant.$view;

    return new Promise((resolve, reject) =>{
      restaurant.queue.queueUp(customer);

      $restaurantView.moveToQueue(customer, restaurant.queue)
        .then(()=>{
          customer.randomSpeak();
          resolve();
        });
    });
  }
  toSeat(idx){
    let customer = this;
    let $restaurantView = this.$restaurantView;
    let restaurant = customer.restaurant;

    return new Promise((resolve, reject) =>{
      if(restaurant.queue.getLength() > 0){
        $restaurantView.updateQueue(restaurant.queue);
      }

      $restaurantView.moveToSeat(customer.element, idx)
        .then(()=>{

          resolve(customer);
        });
    });
  }
  leave(){
    let customer = this;
    let $restaurantView = customer.$restaurantView;
    let restaurant = customer.restaurant;
    let idx = restaurant.seats.getTableIndex(customer);

    $restaurantView.removeOrderedList();
    restaurant.seats.leave(idx);

    $restaurantView.moveToExit(customer);
  }
  order(){
    let customer = this;
    let $restaurantView = this.$restaurantView;
    let menu = customer.restaurant.menu.getMenu();

    return new Promise((resolve, reject)=>{
      let randomNum = getRandom(1, 4);


      for(let i = 0; i < randomNum; i++){
        let randomIdx = getRandom(0, menu.length - 1);
        let orderedFood = menu[randomIdx];

        let sameOrdered = customer.ordered.some(food=> food.name === orderedFood);
        if(!sameOrdered){
          let copyFood = copyObject(orderedFood);

          copyFood.customer = customer;
          customer.ordered.push(copyFood);
        }else{
          i -= 1; //这次选菜不算数
        }
      }

      $restaurantView.orderFood(customer).then(()=>{
        let foodNames = customer.ordered.map(food=> food.name)
        customer.say('order', foodNames.join('，'));
        $restaurantView.updataOrdered(customer.ordered);
        resolve(customer)
      });

      function copyObject(origin){
        let originPrototype = Object.getPrototypeOf(origin);
        let target = Object.assign(Object.create(originPrototype), origin);

        return target;
      }
    });
  }
  eat(food){
    let customer = this;
    let $restaurantView = this.$restaurantView;

    return new Promise((resolve, reject)=>{
      $restaurantView.eating(customer)
        .then(()=>{
          food.eated();
          $restaurantView.updataOrdered(customer.ordered);
          resolve(food);
        });
    });
  }
  working(){
    this.state = 'working';
  }
  waiting(){
    this.state = 'waiting';
  }
  addTask(type, ...args){
    this.taskStack.push([type, args]);
    this.do();
  }
  do(){
    let customer = this;

    if(customer.state === 'waiting' && customer.taskStack.length > 0){
      customer.working();

      let [type, args] = customer.taskStack.shift();

      if(type === 'queueup'){
        customer.queueUp(...args)
          .then(()=>{
            customer.waiting();
            customer.restaurant.emit('queueup');
            customer.do();
          });
      }else if(type === 'toseat'){
        return customer.toSeat(...args)
          .then((customer)=>{
            customer.waiting();
            customer.restaurant.emit('sitin', customer);
            customer.do();
          });
      }else if(type === 'order'){
        return customer.order(...args)
          .then((customer)=>{
            customer.waiting();
            customer.restaurant.emit('ordered', customer);
            customer.do();
          });
      }else if(type === 'eat'){
        return customer.eat(...args)
          .then(food =>{
            customer.waiting();
            customer.restaurant.emit('eaten', customer);
            customer.do();
          });
      }else if(type === 'leave'){
        customer.leave(...args);
        customer.restaurant.emit('left', customer);
      }
    }
  }
}

export {Customer};