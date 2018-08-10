const WIDTH = 800;
const HEIGHT = 400;
let _ = {
  axis:{
    basePoint:[65, 350],
    x:{
      line:{
        length: 550,
        partCount: 11,
        distribut: 'both'
      },
      text:{}
    },
    y:{
      line:{
        length: 250,
        partCount: 5,
        distribut: 'both'
      },
      text:{}
    }
  },
  line:{},
  category:{
    basePoint: [645, 40],
    attrWidth: 75,
    attrHeight: 40,
    textOffset: -45,
    colorBoxWidth: 20
  }
};

const SCALE_LEVELS = [5, 10, 20, 50, 100, 200, 300];

const LINE_COLOR = ['IndianRed', 'LawnGreen', 'RosyBrown', 'Chocolate', 'Maroon', 'DarkGreen', 'DarkRed', 'MediumVioletRed', 'DarkOrange', 'DarkCyan', 'SteelBlue', 'Magenta', 'Navy', 'MediumSlateBlue'];

export default class Line{
  constructor(id){
    this.$container = document.querySelector(id);

  }
  render(data){
    let canvasString = `<canvas class="base-axis" width="${WIDTH}" height="${HEIGHT}"></canvas>`;
    let $baseAxis = createElm(canvasString);

    this.$container.appendChild($baseAxis);
    this.ctx = $baseAxis.getContext('2d');
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.data = data;
    this.evaluate(data);
    this.generateAxis();
    this.generateLines();
    this.generateCategory();
  }
  evaluate(data){

    calculateLineScale(data);
    calculateAxisMark();
    calculateMarkText(data);
    calculateDashedLine();
    calculateData(data);
    calculateCategory(data);

    function calculateAxisMark(){

      calculateXMarkPoint();
      calculateYMarkPoint();

      function calculateXMarkPoint(){
        if(_.axis.x.line.distribut === 'both'){
          let length = _.axis.x.line.partCount + 1;
          let positions = {length: length};
          let partLength = _.axis.x.line.length / _.axis.x.line.partCount;

          _.axis.x.line.markPoint = Array.from(positions).map((position, idx) =>{
            return [idx * partLength, 0];
          });
        }
      }

      function calculateYMarkPoint(){
        if(_.axis.y.line.distribut === 'both'){
          let length = _.axis.y.line.partCount + 1;
          let positions = {length: length};
          let partLength = _.axis.y.line.length / _.axis.y.line.partCount;

          _.axis.y.line.markPoint = Array.from(positions).map((position, idx) =>{
            return [0, 0 - idx * partLength];
          })
        }
      }
    }

    function calculateLineScale(data){
      let maxData = data.map((rolItem, idx) =>{
        let data = rolItem.chunk.concat();
        data.sort((a, b) => b - a);
        return data[0];
      });
      let maxNumber = maxData.sort((a, b) => b - a)[0];
      let average = maxNumber / _.axis.y.line.partCount;
      let suitedLevel = SCALE_LEVELS.find(level => average < level);
      _.axis.y.line.partScaleLength = suitedLevel;

      _.line.scale = _.axis.y.line.length / _.axis.y.line.partCount / suitedLevel;
    }

    function calculateMarkText(data){
      calculateXMarkText(data);
      calculateYMarkText(data);
      function calculateXMarkText(data){
        let xLine = _.axis.x.line;
        let shim = 0;

        if(xLine.distribut === 'both'){
          shim = 1; // 如果线两端都有标记的话就下面idx加1
        }

        _.axis.x.text = xLine.markPoint.map((point, idx) =>{
          let text = (idx + shim) + '月';
          let x = point[0];
          let y = point[1] + 30;
          return [text, x, y];
        });
      }
      function calculateYMarkText(data){
        let yLine = _.axis.y.line;
        let shim = 0;

        if(yLine.distribut === 'middle'){
          shim = 1; // 如果线两端没有标记的话就下面idx加1
        }

        _.axis.y.text = yLine.markPoint.map((point, idx) =>{
          let text = (idx + shim) * _.axis.y.line.partScaleLength;
          let x = point[0] - 10;
          let y = point[1] + 5;
          return [text, x, y];
        })
      }
    }

    function calculateDashedLine(){
      _.axis.y.line.dashedLine = _.axis.y.line.markPoint.reduce((data, point, idx) =>{
        if(point[0] === 0 && point[1] === 0){return data;
        }else{
          let target = [_.axis.x.line.length, point[1]];

          data.push([point, target]);

          return data;
        }
      }, []);
    }

    function calculateData(data){
      let xMarkPoint = _.axis.x.line.markPoint;

      data.forEach((item, idx) =>{
        let chunk = item.chunk;
        item.chunkPositions = chunk.map((amount, idx) =>{
          let x = xMarkPoint[idx][0];
          let y = 0 - _.line.scale * amount;
          return [x, y];
        });
        item.lineColor = LINE_COLOR[idx];
      });
    }

    function calculateCategory(data){
      let attrWidth = _.category.attrWidth;
      let attrHeight = _.category.attrHeight;
      let textOffset = _.category.textOffset;
      data.forEach((item, itemIdx) =>{
        let currAttrHeight = itemIdx * attrHeight
        let lineColorPosition = [0, currAttrHeight]
        item.categoryPositions = [[lineColorPosition, item.lineColor]];

        item.category.forEach((attr, attrIdx) =>{
          let x = (attrIdx + 1) * attrWidth + textOffset;
          let position = [x, currAttrHeight];
          item.categoryPositions.push([position, attr[1]]);
        });
      })
    }
  }
  generateAxis(){
    let self = this;

    generateBaseline();
    generateMarkPoint();
    generateDashedLine();
    generateMarkText();

    function generateBaseline(){
      self.ctx.save();
      self.ctx.strokeStyle = '#666';
      self.ctx.lineWidth = 1;
      self.ctx.translate(..._.axis.basePoint);
      self.ctx.moveTo(_.axis.x.line.length, 0);
      self.ctx.lineTo(0, 0);
      self.ctx.lineTo(0, 0 - _.axis.y.line.length);
      self.ctx.stroke();
      self.ctx.restore();
    }

    function generateMarkPoint(){
      self.ctx.save();
      let xMarkPointCount, yMarkPointCount;
      let xMarkPoint = _.axis.x.line.markPoint;
      let yMarkPoint = _.axis.y.line.markPoint;

      self.ctx.strokeStyle = '#666';
      self.ctx.lineWidth = 1;
      self.ctx.lineCap = 'square';
      self.ctx.translate(..._.axis.basePoint);

      xMarkPoint.forEach((point, idx) =>{
        self.ctx.moveTo(...point);
        self.ctx.lineTo(point[0],5);
      })
      self.ctx.stroke();

      yMarkPoint.forEach((point, idx) =>{
        self.ctx.moveTo(...point);
        self.ctx.lineTo(-5, point[1]);
      })
      self.ctx.stroke();

      self.ctx.restore();
    }

    function generateDashedLine(){
      let dashedLine = _.axis.y.line.dashedLine;
      self.ctx.save();

      self.ctx.translate(..._.axis.basePoint);
      self.ctx.strokeStyle = '#ccc';
      self.ctx.lineWidth = 1;

      dashedLine.forEach((point, idx) =>{
        self.ctx.moveTo(...point[0]);
        self.ctx.lineTo(...point[1]);
      })
      self.ctx.stroke();

      self.ctx.restore();
    }

    function generateMarkText(){
      let xText = _.axis.x.text;
      let yText = _.axis.y.text;
      self.ctx.save();
      self.ctx.translate(..._.axis.basePoint);
      self.ctx.fillStyle = '#666';
      self.ctx.textAlign = 'center';
      self.ctx.font = '18px sans-serif';

      xText.forEach(item => self.ctx.fillText(...item));

      self.ctx.textAlign = 'right';

      yText.forEach(item => self.ctx.fillText(...item));

      self.ctx.restore();
    }
  }
  generateLines(){
    this.data.forEach((item) =>{
      let $lineCanvas = createElm(`<canvas width="${WIDTH}" height="${HEIGHT}"></canvas>`);
      this.$container.appendChild($lineCanvas);
      item.element = $lineCanvas;

      generateLine($lineCanvas, item);
    }, this)


    function generateLine($lineCanvas, item){
      let circleRadius = 5;

      let $ctx = $lineCanvas.getContext('2d');
      $ctx.save();
      $ctx.translate(..._.axis.basePoint);
      $ctx.strokeStyle = item.lineColor;
      $ctx.fillStyle = 'white';

      item.chunkPositions.forEach((position, idx) =>{

        $ctx.lineTo(...position);

        if(idx !== 0){
          $ctx.moveTo(...position);
          $ctx.arc(...position, circleRadius, 0, Math.PI * 2, true);
        }

        $ctx.moveTo(...position);
      });

      $ctx.stroke();
      $ctx.fill();
    }
  }
  generateCategory($canvas){
    let self = this;
    let $ctx;
    let colorBoxWidth = _.category.colorBoxWidth;

    if(!$canvas){
      let canvasString = `<canvas class="category" width="${WIDTH}" height="${HEIGHT}"></canvas>`;
      let $categoryCanvas = createElm(canvasString);

      self.$container.appendChild($categoryCanvas);
      self.$categoryCanvas = $categoryCanvas;
      $ctx = $categoryCanvas.getContext('2d');
    }else{
      $ctx = $canvas.getContext('2d');
      $ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    $ctx.save();
    $ctx.translate(..._.category.basePoint);
    $ctx.fillStyle = '#333';
    $ctx.font = '16px sans-serif';
    $ctx.strokeStyle = 'black';
    $ctx.strokeWidth = 1;
    $ctx.textBaseline = 'top';
    self.data.forEach((item, idx) =>{
      if(item.element.className === 'hide') return;

      item.categoryPositions.forEach((attr, attrIdx) =>{
        if(attrIdx === 0){
          $ctx.save();
          $ctx.fillStyle = attr[1];
          $ctx.fillRect(...attr[0], colorBoxWidth, colorBoxWidth);
          $ctx.restore();
        }else{
          $ctx.fillText(attr[1], ...attr[0])
        }
      });
    });
    $ctx.restore();
  }
  showSingleLine(data){
    let selectedCategoryString = data.category.sort().toString();
    this.data.forEach(item =>{
      let categoryString = item.category.sort(). toString();
      if(categoryString === selectedCategoryString){
        item.element.className = '';
      }else{
        item.element.className = 'hide'
      }
    });

    this.generateCategory(this.$categoryCanvas);
  }
  showAllLine(){
    this.data.forEach(item =>{
      item.element.className = '';
    })

    this.generateCategory(this.$categoryCanvas);
  }
}

function createElm(string){
  let div = document.createElement('div');
  div.innerHTML = string;
  return div.children[0];
}