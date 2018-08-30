let footballFieldScale = {
  baseLine: {
    lineWidth: 2,
    lineStyle: 'white',
    outRectDistance: [40, 20],
    innerRect: {// 内框高度为比例;
      small: [0.015, 0.1],
      middle: [0.08, 0.27],
      big: [0.25, 0.6]
    },
    innerRound: {
      radius: 0.13
    }
  }


}

export {footballFieldScale as _};