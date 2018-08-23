

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

export {transTime, getRandom, getRandomID, createElement};