function getRandom(start, end){
  let offset = end - start;

  let randomOffset = Math.round(offset * Math.random());

  return start + randomOffset;
}

export {getRandom}