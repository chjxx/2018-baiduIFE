function transToPX(positions, ctWidth, ctHeight){
  ctWidth = parseFloat(ctWidth);
  ctHeight = parseFloat(ctHeight);

  roll(positions);

  function roll(object){
    if(Array.isArray(object)){
      rollArray(object);
    }else{
      for(let key in object){
        if(object.hasOwnProperty(key)){
          roll(object[key]);
        }
      }
    }

  }
  function rollArray(array){
    array.forEach((item, idx) =>{
      if(Array.isArray(item)){
        rollArray(item);
      }else if(typeof item === 'number'){
        if(idx === 0){
          array[idx] = ctWidth * item / 100;
        }else if(idx === 1){
          array[idx] = ctHeight * item / 100;
        }
      }
    });
  }
}

function getRandom(start, end){
  let offset = end - start;

  let randomOffset = Math.round(offset * Math.random());

  return start + randomOffset;
}

let getRandomID = getRandom.bind(null, 10000000, 99999999);

function createElement(string){
  let div = document.createElement('div');
  div.innerHTML = string;
  return div.children[0];
}

function transTime(millisecond){
  let minute = Math.floor(millisecond / 1000 / 60 % 60);
  let section = Math.floor(millisecond / 1000 % 60);

  let timeArray = [minute, section];

  timeArray = timeArray.reduce((array, time) =>{
    if(time < 0) time = 0;
    time = time.toString();
    if(time.length === 1){
      time = '0' + time;
    }
    array.push(time);
    return array;
  }, [])
  return timeArray.join(':');
}

function copyObject(origin){
  let originPrototype = Object.getPrototypeOf(origin);
  let target = Object.assign(Object.create(originPrototype), origin);

  return target;
}

export {transToPX, transTime, getRandom, getRandomID, createElement, copyObject};