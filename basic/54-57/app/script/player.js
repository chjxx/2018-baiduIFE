import {getRandom} from './unit.js';

export default class Player{
  constructor(){

  }
  static factory(type, config){
    if(typeof Player[type] === 'function'){
      return Player[type](config);
    }
  }
  static football(config = {}){
    return new FootballPlayer(config);
  }
}

class FootballPlayer extends Player{
  constructor({maxSpeed, physical, explosive}){
    super();
    this.id = getRandom(1000, 9999);
    this.radius = 10; // 显示的半径，10代表1米
    this.maxSpeed = maxSpeed || getRandom(1, 99);
    this.physical = physical || getRandom(1, 99);
    this.explosive = explosive || getRandom(1, 99);
  }
  enter(field){
    this.field = field;
    this.ctx = field.ctx;

    return this;
  }
  setStartPoint(x, y){
    this.currentX = this.startX = x;
    this.currentY = this.startY = y;

    return this;
  }
  render(x, y){
    x = x || this.currentX;
    y = y || this.currentY;

    this.ctx.save();

    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'white';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    // this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();

    return this;
  }
  runTo(destinationX, destinationY){
    let self = this;
    let startTime = new Date();
    let currentSpeed = 1;
    let speedUpTime = self.calculateSpeedUpTime(self.explosive); //提速时间
    let holdingTime = self.calculateHoldingTime(self.physical); //最高速度坚持时间
    let xDistance = destinationX - self.startX;
    let yDistance = destinationY - self.startY;
    let xDistanceAbs = Math.abs(xDistance); //绝对值，用于检测是否到达终点
    let yDistanceAbs = Math.abs(yDistance); //绝对值，用于检测是否到达终点
    let radian = Math.atan2(yDistance, xDistance); //到终点的弧度
    let reach = false; //是否到达终点
    let reachTime; //到达终点的时间
    let reachSpeed; //到达终点时的速度，为后面停止做参数计算

    return new Promise((resolve, reject) =>{
      requestAnimationFrame(function update(){
        let curtime = new Date();
        let periodTime = curtime - startTime;
        let offsetX, offsetY, sumOffsetX, sumOffsetY;

        if(!reach){
          // 如果还未到达终点
          if(periodTime <= speedUpTime){
            currentSpeed = (periodTime / speedUpTime) * self.maxSpeed;
          }else if(periodTime < (speedUpTime + holdingTime)){
            currentSpeed = self.maxSpeed;
          }else{
            // 超过最高速度的坚持时间后每秒下降5个速度点
            let speed = currentSpeed - (periodTime - speedUpTime - holdingTime) / 1000 * 5;

            currentSpeed = Math.max(speed, 1); // 减到少于1以后就取1为速度
          }
        }else{
          // 如果已到达终点0.5秒停下
          let overPeriodTime = curtime - reachTime;
          currentSpeed = reachSpeed - overPeriodTime / 500 * reachSpeed;
          currentSpeed = Math.max(currentSpeed, 0);
        }

        offsetX = Math.cos(radian) * self.calculateMeter(currentSpeed) / 60 * 10; //除以60是浏览器1秒大约刷新次数，乘以10是因为 10个单位为1米
        offsetY = Math.sin(radian) * self.calculateMeter(currentSpeed) / 60 * 10;

        self.currentX += offsetX;
        self.currentY += offsetY;

        sumOffsetX = Math.abs(self.currentX - self.startX);
        sumOffsetY = Math.abs(self.currentY - self.startY);

        if(xDistanceAbs <= sumOffsetX && yDistanceAbs <= sumOffsetY){
          reach = reach || true;
          reachTime = reachTime || new Date();
          reachSpeed = reachSpeed || currentSpeed;

          if(currentSpeed === 0){
            self.startX = self.currentX;
            self.startY = self.currentY;

            console.log(`period: ${new Date() - startTime}`)

            resolve();
          }else{
            requestAnimationFrame(update);
          }
        }else{
          requestAnimationFrame(update);
        }
      });
    });
  }
  calculateMeter(speed){
    return 3 + (speed - 1) / 98 * 9;
  }
  calculateSpeedUpTime(explosive){
    return 4000 - (explosive - 1) / 98 * 3000;
  }
  calculateHoldingTime(physical){
    return 10000 + (physical - 1) / 98 * 5000;
  }
}

export {Player, FootballPlayer};