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
  constructor({maxSpeed, energy, explose}){
    super();

    this.radius = 10;
    this.maxSpeed = maxSpeed || getRandom(1, 99);
    this.energy = energy || getRandom(1, 99);
    this.explose = explose || getRandom(1, 99);
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
    this.ctx.fill();

    this.ctx.restore();

    return this;
  }
  runTo(destinationX, destinationY){
    let self = this;
    let startTime = new Date();
    let currentSpeed = self.calculateMeter(1);
    let speedTime = self.calculateSpeedTime(self.explose);
    let keepTime = self.calculateKeepTime(self.energy);
    let xDirection = destinationX - self.startX;
    let yDirection = destinationY - self.startY;
    let xAbsDirection = Math.abs(xDirection);
    let yAbsDirection = Math.abs(yDirection);
    let angle = Math.atan2(yDirection, xDirection);
    let max = false;

    return new Promise((resolve, reject) =>{
      requestAnimationFrame(function update(){
        let nowTime = new Date();
        let offsetTime = nowTime - startTime;
        let offsetX, offsetY, sumOffsetX, sumOffsetY;

        if(!max){
          if(offsetTime <= speedTime){
            let speed = offsetTime / speedTime * self.maxSpeed
            currentSpeed = Math.min(speed, self.maxSpeed);
          }

          if(offsetTime >= (speedTime + keepTime)){
            let speed = currentSpeed - (offsetTime - speedTime - keepTime) * 0.01;
            currentSpeed = Math.max(speed, 0);
          }
        }else{
          if(currentSpeed > 50){
            currentSpeed = Math.max(currentSpeed - 20, 0);
          }else if(currentSpeed > 20){
            currentSpeed = Math.max(currentSpeed - 8, 0);
          }else{
            currentSpeed = Math.max(currentSpeed - 3, 0);
          }
        }


        offsetX = Math.cos(angle) * currentSpeed;
        offsetY = Math.sin(angle) * currentSpeed;

        self.currentX += offsetX;
        self.currentY += offsetY;

        sumOffsetX = Math.abs(self.currentX - self.startX);
        sumOffsetY = Math.abs(self.currentY - self.startY);

        if(xAbsDirection <= sumOffsetX && yAbsDirection <= sumOffsetY){
          max = max || true;

          if(currentSpeed === 0){
            self.startX = self.currentX;
            self.startY = self.currentY;

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
  calculateSpeedTime(explose){
    return 4000 - (explose - 1) / 98 * 3000;
  }
  calculateKeepTime(energy){
    return 10000 + (energy - 1) / 98 * 5000;
  }
}

export {Player, FootballPlayer};