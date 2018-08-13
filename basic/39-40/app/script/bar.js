let _ = {
  axis:{
    basePoint: [100, 350],
    x:{
      line:{},
      text:{}
    },
    y:{
      line:{
        length: 250,
        partCount: 5,
        distribut: 'endpoint'
      },
      text:{}
    }
  },
  bar:{
    width: 40
  },
  category:{
    basePoint: [650, 40]
  }
};

const SCALE_LEVELS = [5, 10, 20, 50, 100, 200, 300];

export default class Bar{
  constructor(id, config){
    this.$container = document.querySelector(id);
    _ = Object.assign(_, config);
  }
  render(data){
    this.evaluat(data);
    this.$container.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
      ${this.generateAxis(data)}
      ${this.generateBar(data)}
      ${this.generateCategory(data)}
    </svg`;
  }
  evaluat(data){
    let self = this;

    calculateBarScale(data);
    calculateXAxis(data);
    calculateAxisMark(data);
    calculateDashedLine(data);
    calculateLineText(data);
    calculateBar(data);
    calculateCategory(data);

    function calculateBarScale(data){
      let dataCopy = data.chunk.concat();
      let maxNumber = dataCopy.sort((a, b) => b - a)[0];
      let yPartCount = _.axis.y.line.partCount;
      let yLineLength = _.axis.y.line.length;
      let average = maxNumber / yPartCount;

      let suitedLevel = SCALE_LEVELS.find(level => average <= level);
      _.axis.y.line.partScaleLength = suitedLevel;
      _.bar.scale = yLineLength / yPartCount / suitedLevel;
    }

    function calculateXAxis(data){
      _.axis.x.line.partCount = data.chunk.length + 1;
      _.axis.x.line.partLength = _.bar.width + 10;
      _.axis.x.line.length = _.axis.x.line.partCount * _.axis.x.line.partLength
    }

    function calculateAxisMark(data){
      let markCount = data.chunk.length;
      let lengthObj = {length: markCount};
      let xPartLength = _.axis.x.line.partLength;

      _.axis.x.line.markPoint = Array.from(lengthObj).map((item, idx) =>{
        let xPosition = _.axis.basePoint[0] + (idx + 1) * xPartLength;
        return [xPosition, _.axis.basePoint[1]];
      });

      if(_.axis.y.line.distribut === 'endpoint'){
        let markCount = _.axis.y.line.partCount + 1;
        let lengthObj = {length: markCount};
        let yPartLength = _.axis.y.line.length / _.axis.y.line.partCount;

        _.axis.y.line.markPoint = Array.from(lengthObj).map((item, idx) =>{
          let yPosition = _.axis.basePoint[1] - yPartLength * idx;
          return [_.axis.basePoint[0], yPosition]
        });
      }
    }

    function calculateDashedLine(){
      if(_.axis.y.line.distribut === 'endpoint'){
        _.axis.y.line.dashedLine = _.axis.y.line.markPoint.reduce((data, point, idx) =>{
          if(idx !== 0){
            data.push([...point, _.axis.x.line.length]);
          }

          return data;
        }, []);
      }
    }

    function calculateLineText(){
      _.axis.y.text.data = _.axis.y.line.markPoint.map((position, idx) =>{
        let text = _.axis.y.line.partScaleLength * idx;
        return [position[0] - 10, position[1] + 5, text];
      });
      _.axis.x.text.data = _.axis.x.line.markPoint.map((position, idx) =>{
        let text = (idx + 1) + '月';
        return [position[0], position[1] + 30, text];
      });
    }

    function calculateBar(data){
      let offset = -(_.bar.width / 2);
      _.bar.data = data.chunk.map((val, idx) =>{
        let markPoint = _.axis.x.line.markPoint[idx];
        let height = _.bar.scale * val;
        let y = markPoint[1] - _.bar.scale * val;
        let x = markPoint[0] + offset;
        return [x, y, height];
      });
    }

    function calculateCategory(data){
      let category = data.category;

      _.category.data = category.reduce((data, item, idx) =>{
        let x = _.category.basePoint[0];
        let y = _.category.basePoint[1] + idx * 25;
        data.push([x, y, item]);
        return data;
      }, [])
    }
  }
  generateAxis(data){
    let self = this;
    let innerHTML = generateBasicAxis(data) + generateText(data);

    return innerHTML;

    function generateBasicAxis(data){
      let moveToBasePoint = `M${_.axis.basePoint.join(' ')}`;

      return `<path class="axis-line" d="${generateLine() + generateMark()}"
      ></path>${generateDashedLine()}`;

      function generateLine(){
        return `${moveToBasePoint} v ${-_.axis.y.line.length} ${moveToBasePoint} h ${_.axis.x.line.length}`;
      }

      function generateMark(){
        let innerHTML = '';

        innerHTML += _.axis.y.line.markPoint.reduce((innerHTML, position) => `${innerHTML} M${position.join(' ')} h -5`, '');

        innerHTML += _.axis.x.line.markPoint.reduce((innerHTML, position) => `${innerHTML} M${position.join(' ')} v 5`, '');

        return innerHTML;
      }

      function generateDashedLine(){
        return `<path class="axis-dashed-line" d="${generateD()}"></path>`;

        function generateD(){
          return _.axis.y.line.dashedLine.reduce((d, data, idx) => {
            d += `M${data.slice(0, 2).join(' ')} h ${data[2]} `;

            return d;
          }, '');
        }
      }
    }

    function generateText(data){

      return generateXText() + generateYText();

      function generateXText(){
        return `<text class="x-axis-text">
        ${_.axis.x.text.data.reduce((innerHTML, data) =>{
          return `${innerHTML}<tspan x="${data[0]}" y="${data[1]}" text-anchor="middle">${data[2]}</tspan>`;
        }, '')}
        </text>`;
      }

      function generateYText(){
        return `<text class="y-axis-text">
        ${_.axis.y.text.data.reduce((innerHTML, data) =>{
          return `${innerHTML}<tspan x="${data[0]}" y="${data[1]}" text-anchor="end">${data[2]}</tspan>`;
        }, '')}
        </text>`;
      }
    }
  }
  generateBar(){
    return `<g>
      ${_.bar.data.reduce((innerHTML, data) =>{
        return `${innerHTML}<rect class="chart-bar" x="${data[0]}" y="${data[1]}" height="${data[2] - .5}" width="${_.bar.width}"></rect>`;
      }, '')}
    </g>`;
  }
  generateCategory(){
    return `<text class="category">
      ${_.category.data.reduce((innerHTML, data) =>{
        return `${innerHTML}<tspan x="${data[0]}" y="${data[1]}" text-anchor="start">${data[2].join(': ')}</tspan>`;
      }, '')}
    </text>`;
  }
}