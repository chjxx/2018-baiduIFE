import {positions, timeUnit} from './model.js';
import {transToPX, createElement, getRandom, transTime} from './unit.js';

export default class View{
  constructor(id, restaurant, timeScale){
    this.timeScale = timeScale;
    this.restaurant = restaurant;
    this.$container = document.querySelector(id);
    this.$restaurantCtrl = this.$container.querySelector('.restaurant-state');
    this.$restaurantState = this.$restaurantCtrl.querySelector('.state');
    this.$employeeList = this.$restaurantCtrl.querySelector('.employees')
    this.$cashNum = this.$container.querySelector('.cash-bar .count');
    this.$cookList = this.$container.querySelector('.kitchen .cookList ul');
    this.$kitchenWorkplaces = this.$container.querySelectorAll('.kitchen .work-place');
    this.$orderedList = this.$container.querySelectorAll('.table .list');
    this.$tableStates = this.$container.querySelectorAll('.table .state');
    this.$customerCt = this.$container.querySelector('.man .customers');
    this.$employeeCt = this.$container.querySelector('.man .employees');
    this.cashType = '$';
    let ctWidth = getComputedStyle(this.$container).width;
    let ctHeight = getComputedStyle(this.$container).height;

    transToPX(positions, ctWidth, ctHeight); // 转换之后得到px单位的position值
    this.addEventListener();
  }
  changeRestaurantState(type){
    if(type === 'initial'){
      this.$restaurantState.innerHTML = '未营业';
    }else if(type === 'opening'){
      this.$restaurantState.innerHTML = '营业中';
    }
  }
  addEventListener(){
    let self = this;

    this.$restaurantCtrl.addEventListener('click', (event)=>{
      let $clickElm = event.target;

      if($clickElm.className === 'open'){
        self.restaurant.start();

      }else if($clickElm.classList.contains('add')){
        let employee, type;
        if($clickElm.classList.contains('add-waiter')){
          type = 'waiter';
        }else if($clickElm.classList.contains('add-chef')){
          type = 'chef';
        }

        if(type){
          employee = self.restaurant.createEmployee(type);
        }

        if(employee){
          self.restaurant.hire(employee);
        }
      }else if($clickElm.className === 'fire'){
        let type = $clickElm.dataset.type;
        let id = parseInt($clickElm.dataset.id);
        let employee = self.restaurant.staff.findTypeEmployee(type, id);

        if(employee){
          self.restaurant.fire(employee);
        }
      }
    })
  }
  setCash(cash){
    if(this.$cashNum){
      this.$cashNum.innerText = this.cashType + cash;
    }
  }
  getCookStateItem($workplace){
    return $workplace.querySelector('.state');
  }
  clearCookState(chefIndex){
    let $workplace = this.$kitchenWorkplaces[chefIndex];
    let $cookState = this.getCookStateItem($workplace);

    $cookState.innerHTML = '';
  }
  initialCookState(chefIndex){
    let $workplace = this.$kitchenWorkplaces[chefIndex];
    let $cookState = this.getCookStateItem($workplace);

    $cookState.innerHTML = '';
  }
  updateEmployeelist(){
    let allStaff = this.restaurant.staff.getAllEmployees();

    let innerHTML = allStaff.reduce((innerHTML, employee)=>{
      return innerHTML += `<li class="employee">
          <div class="avatar" style="background-image: url(${employee.avatarUrl})"></div>
          <div class="detail">
            <p><span>薪水：</span><span class="salary">${employee.salary}</span></p>
            <a href="javascript:;" class="fire" data-type="${employee.type}" data-id="${employee.id}">解雇员工</a>
          </div>
        </li>`;
    }, '');

    this.$employeeList.innerHTML = innerHTML;
  }
  updateTableState(tableIndex, type, string){
    if(type === 'initial'){
      this.$tableStates[tableIndex].innerHTML = '';
    }else if(type === 'ordering'){
      this.$tableStates[tableIndex].innerHTML = '点菜中...';
    }else if(type === 'eating'){
      this.$tableStates[tableIndex].innerHTML = `正在吃${string}...`;
    }else if(type === 'checkout'){
      this.$tableStates[tableIndex].innerHTML = '结账中...';
    }
  }
  updateCookState(chefIndex, food){
    let $workplace = this.$kitchenWorkplaces[chefIndex];
    let $cookState = this.getCookStateItem($workplace);
    let cookTime = food.cookTime * this.timeScale;

    return new Promise((resolve, reject)=>{
      kitchenStateUpdate(resolve);
    });

    function kitchenStateUpdate(resolve){
      let start = new Date();

      return requestAnimationFrame(function update(){
        let now = new Date();
        let offset = now - start;

        let innerHTML = `<span class="thing">正在做：${food.name}</span><span class="time">${transTime(cookTime - offset)}</span>`;

        $cookState.innerHTML = innerHTML;

        if(offset < cookTime){
          requestAnimationFrame(update);
        }else{
          resolve();
        }
      });
    }
  }
  async moveToQueue(customer, queue){//1
    let $view = this;
    let idx = queue.getQueueIndex(customer);

    if(idx === -1){//如果排不上队列就离开
      let position = positions.character.customer.initial[0];
      uniformSpeedMove(customer.element, position, null, $view.removeCharacter.bind($view, customer));
    }else{
      let position = positions.atLine[idx];

      await new Promise((resolve, reject)=>{
        uniformSpeedMove(customer.element, position, null, resolve);
      });
    }
  }
  updateQueue(queue){//1
    let $view = this;

    queue.getQueue().forEach((customer, idx)=>{
      if(customer){
        $view.moveToQueue(customer, queue);
      }
    });
  }
  addWord($elm, string){//1
    let msgTime = timeUnit.msgTime;
    let time = msgTime * this.timeScale;

    string = string.trim();

    showMessage($elm, string, time);

    function showMessage($elm, string, time){
      let start = new Date();

      $elm.style.zIndex = 1;
      $elm.innerHTML = `<div class="msg">${string}</div>`;

      return requestAnimationFrame(function update(){
        let now = new Date();
        let offset = now - start;

        if(offset < time){
          requestAnimationFrame(update);
        }else{
          $elm.innerHTML = '';
          $elm.style.zIndex = 0;
        }
      });
    }
  }
  orderFood(customer){//1
    let orderTime = timeUnit.customer.order;
    let timeScale = this.timeScale;
    let time = orderTime * timeScale;
    let self = this;

    this.updateTableState(customer.seatIndex, 'ordering');

    return new Promise((resolve, reject) =>{
      setTimeout(()=>{
        self.updateTableState(customer.seatIndex, 'initial');
        resolve()
      }, time);
    });
  }
  addCharacter(person, idx = 0){//1
    let type = person.type;
    let [initialLeft, initialTop] = positions.character[type].initial[idx];
    let innerHTML = `<div class="${type}" style="background-image: url(${person.avatarUrl}); left: ${initialLeft}px; top: ${initialTop}px;"></div>`;

    let $character = createElement(innerHTML);

    person.element = $character;
    if(type === 'customer'){
      this.$customerCt.appendChild($character);
    }else{
      this.$employeeCt.appendChild($character);
    }
  }
  removeCharacter(person){//1
    let characterType = person.type;

    if(characterType === 'customer'){
      this.$customerCt.removeChild(person.element);
    }else{
      this.$employeeCt.removeChild(person.element);
    }
  }
  updateCookList(foods){//1
    this.$cookList.innerHTML = '';

    let innerHTML = foods.reduce((innerHTML, food) =>{
      return innerHTML + `<li>${food.name}</li>`;
    }, '');

    this.$cookList.innerHTML = innerHTML;
  }
  async moveTo(character, type, typeIndex){//1
    let position;

    if(type === 'entrance'){
      position = positions.atEntrance;
    }else if(type === 'seat'){
      position = positions.atSeat[typeIndex];
    }else if(type === 'table'){
      position = positions.atTable[typeIndex];
    }else if(type === 'kitchenout'){
      position = positions.atKitchenOut[typeIndex];
    }else if(type === 'outrestaurant'){
      position = positions.outRestaurant;
    }else if(type === 'queuehead'){
      position = positions.atLine[0];
    }else if(type === 'initial'){
      position = positions.character[character.type].initial[typeIndex];
    }

    if(position){
      await new Promise((resolve, reject)=>{
        uniformSpeedMove(character.element, position, null, resolve);
      });
    }

    return;
  }
  updateOrdered(foods, seatIndex){//1
    let innerHTML = foods.reduce((innerHTML, food) =>{
      let stateWord;
      let foodState = food.state;

      if(foodState === 'serving'){
        stateWord = '正在做';
      }else if(foodState === 'served'){
        stateWord = '已上菜';
      }else if(foodState === 'eated'){
        stateWord = '已吃完';
      }

      return innerHTML + `<li class="${foodState}"><span>${food.name}</span><i>${stateWord}</i></li>`;
    }, '');

    this.$orderedList[seatIndex].innerHTML = innerHTML;
  }
  removeOrderedList(seatIndex){//1
    this.$orderedList[seatIndex].innerHTML = '';
  }
  async eating(customer, food){
    let eatTime = timeUnit.customer.eat;
    let timeScale = this.timeScale;
    let time = eatTime * timeScale;

    this.updateTableState(customer.seatIndex, 'eating', food.name);

    await new Promise((resolve, reject)=>{
      setTimeout(()=>{
        this.updateTableState(customer.seatIndex, 'initial');
        resolve();
      }, time);
    });
  }
}

function uniformSpeedMove($elm, position, speed, callback){
  let startX = parseFloat(getComputedStyle($elm).left);
  let startY = parseFloat(getComputedStyle($elm).top);
  let [destinationX, destinationY] = position;
  let maxX = Math.abs(destinationX - startX);
  let maxY = Math.abs(destinationY - startY);
  let nowX = startX, nowY = startY;

  if(!speed){
    speed = 10;
  }

  return requestAnimationFrame(function update(){
    let angle = Math.atan2(destinationY - nowY, destinationX - nowX);
    let offsetX = Math.cos(angle) * speed;
    let offsetY = Math.sin(angle) * speed;
    nowX = parseFloat(getComputedStyle($elm).left) + offsetX;
    nowY = parseFloat(getComputedStyle($elm).top) + offsetY;
    let sumOffsetX = Math.abs(nowX - startX);
    let sumOffsetY = Math.abs(nowY - startY);

    $elm.style.left = nowX + 'px';
    $elm.style.top = nowY + 'px';
    console.log( nowY)
    if(maxX <= sumOffsetX && maxY <= sumOffsetY){

      callback();
    }else{
      requestAnimationFrame(update);
    }

  });
}