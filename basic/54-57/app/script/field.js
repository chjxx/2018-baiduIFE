import {_} from './model.js';
import {Player, FootballPlayer} from './player.js';

export default class Field{
  constructor({width, height, contentId}){
    this.width = width;
    this.height = height;
    this.$container = document.querySelector(contentId);

    this.createCanvas(width, height);

  }
  createCanvas(width, height){
    if(this.$container){
      let offsetWidth = this.$container.offsetWidth;
      let offsetHeight = this.$container.offsetHeight;
      let containerScale = offsetHeight / offsetWidth;
      let canvasScale = height / width;
      let style, innerHTML;

      if(containerScale >= canvasScale){
        style = 'width: 100%';
      }else{
        style = 'height: 100%';
      }

      innerHTML = `<canvas width="${width}" height="${height}" style="${style}"></canvas>`;

      this.$canvas = createElement(innerHTML);
      this.$container.appendChild(this.$canvas);
      this.ctx = this.$canvas.getContext('2d');
    }
  }
  static factory(type, config){
    if(typeof Field[type] === 'function'){
      return Field[type](config);
    }
  }
  static football(config){
    return new FootballField(config);
  }
}

class FootballField extends Field{
  constructor(config){
    super(config);

    this.players = [];

    this.start();
  }
  start(){
    let self = this;
    requestAnimationFrame(function update(){
      self.createBackground();
      self.players.forEach(player =>{
        player.render();
      });

      requestAnimationFrame(update);
    });
  }
  createBackground(){
    this.ctx.save();

    // 背景颜色
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle = _.baseLine.lineStyle;
    this.ctx.lineWidth = _.baseLine.lineWidth;

    // 内框
    let radius = this.height * _.baseLine.innerRound.radius;
    let outRectDistance = _.baseLine.outRectDistance;
    this.innerRectWidth = this.width - outRectDistance[0] * 2;
    this.innerRectHeight = this.height - outRectDistance[1] * 2;
    this.ctx.strokeRect(...outRectDistance, this.innerRectWidth, this.innerRectHeight);
    // 圆
    let leftCenterX = ((_.baseLine.innerRect.big[0] - _.baseLine.innerRect.middle[0]) / 2 + _.baseLine.innerRect.middle[0]) * this.height + outRectDistance[0];
    let leftCenterY = this.height / 2;
    let rightCenterX = this.width - leftCenterX;
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2); // 中圆
    this.ctx.moveTo(leftCenterX + radius, leftCenterY);
    this.ctx.arc(leftCenterX, leftCenterY, radius, 0, Math.PI * 2, true); // 左边圆
    this.ctx.moveTo(rightCenterX + radius, leftCenterY);
    this.ctx.arc(rightCenterX, leftCenterY, radius, 0, Math.PI * 2, true); // 右边圆
    // 中线
    this.ctx.moveTo(this.width / 2, outRectDistance[1]);
    this.ctx.lineTo(this.width / 2, this.height - outRectDistance[1]);
    this.ctx.stroke();

    // 小内框
    this.createInnerRect('big', 'left');
    this.createInnerRect('big', 'right');
    this.createInnerRect('middle', 'left');
    this.createInnerRect('middle', 'right');
    this.createInnerRect('small', 'left');
    this.createInnerRect('small', 'right');

    this.ctx.restore();
  }
  createInnerRect(level, position){
    let innerRectWidth = this.innerRectHeight * _.baseLine.innerRect[level][0];
    let innerRectHeight = this.innerRectHeight * _.baseLine.innerRect[level][1];
    let outRectDistance = _.baseLine.outRectDistance
    let startX, startY;

    if(level === 'small'){
      if(position === 'left'){
        startX = outRectDistance[0] - innerRectWidth;
      }else{
        startX = this.width - outRectDistance[0];
      }
    }else{
      if(position === 'left'){
        startX = outRectDistance[0];
      }else{
        startX = this.width - outRectDistance[0] - innerRectWidth;
      }
    }

    startY = (this.height - innerRectHeight) / 2;

    this.ctx.save();

    this.ctx.strokeStyle = _.baseLine.lineStyle;
    this.ctx.lineWidth = _.baseLine.lineWidth;
    this.ctx.fillRect(startX, startY, innerRectWidth, innerRectHeight);
    this.ctx.strokeRect(startX, startY, innerRectWidth, innerRectHeight);

    this.ctx.restore();
  }
  addPlayer(player){
    if(player.constructor === FootballPlayer){
      player.enter(this);
      this.players.push(player);
    }
  }
}



function createElement(string){
  let div = document.createElement('div');
  div.innerHTML = string;
  return div.children[0];
}