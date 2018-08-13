const TITLE = { // 给原数据某些属性加中文
  region: '地区',
  product: '商品'
};

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

export default class Model{
  constructor(JSONString){
    let localData = localStorage.getItem('dataModel');
    if(!localData){
      localStorage.setItem('dataModel', JSONString)
      this.data = JSON.parse(JSONString);
    }else{
      this.data = JSON.parse(localData);
    }
  }
  /**
   * 获取选项数据
   * @return { object }
   */
  getOptionsData(){
    this.optsObj = this.data.reduce((optsObj, dataObj) =>{
      for(let prop in dataObj){
        if(dataObj.hasOwnProperty(prop)){
          if(optsObj.hasOwnProperty(prop)){
            if(optsObj[prop].options.indexOf(dataObj[prop]) === -1){ // 如果已筛选的数据没有当前遍历到的选项则插入
              optsObj[prop].options.push(dataObj[prop]);
            }
          }else{
            if(prop !== 'sale'){
              optsObj[prop] = {}
              optsObj[prop].options = [dataObj[prop]];
              optsObj[prop].title = TITLE[prop] ? TITLE[prop] : '';
            }
          }
        }
      }
      return optsObj;
    }, {});

    return this.optsObj;
  }
  /**
   * 根据传进来的选项数据查找数据并整合好返回，数据用于创建table
   * @param  {Object} chosenOptions
   * @return {Array}
   */
  searchData(chosenOptions){
    let self = this;

    for(let prop in chosenOptions){
      if(chosenOptions.hasOwnProperty(prop)){
        if(chosenOptions[prop].length === 0) return; // 如果有选项条没有选择选项则返回
      }
    }

    if(chosenOptions.region.length === 1){
      return pickData([self.data, chosenOptions, ['region', 'product']]);
    }else{
      return pickData([self.data, chosenOptions, ['product', 'region']]);
    }

    function pickData([data, chosenOptions, order]){
      let result = {};

      result.title = getTitles();
      result.body = [];

      roll({ctArr: result.body, data: data});

      return result;

      /**
       * 遍历器，用于table数据整合
       * @param  {Number} options.orderIdx 选项顺序索引
       * @param  {Array} options.ctArr 当前选项容器
       * @param  {Array} options.data 上一个选项筛选后的数据
       * @return {None}
       */
      function roll({orderIdx = 0, ctArr, data}){
        chosenOptions[order[orderIdx]].forEach(option => {
          let obj = {
            name: order[orderIdx],
            val: option
          }

          if(orderIdx === order.length - 1){
            let item = data.find(item => item[order[orderIdx]] === option);
            obj.sale = item.sale;
            ctArr.push(obj);
          }else{
            obj.options = [];
            ctArr.push(obj);

            let dataArr = data.filter(item => item[order[orderIdx]] === option);
            roll({orderIdx: orderIdx + 1, ctArr: obj.options, data: dataArr});
          }
        });
      }

      function getTitles(){
        let titles = order.reduce((arr, option) => {
          arr.push(TITLE[option] ? TITLE[option] : option);
          return arr;
        }, []);

        return titles.concat(MONTHS);
      }

    }
  }
  updateData(trData){
    trData.category.reduce((data, category, idx) => {
      let attr;

      for(let key in TITLE){
        if(TITLE.hasOwnProperty(key)){
          if(TITLE[key] === category[0]){
            attr = key;
          }
        }
      }

      if(idx !== trData.category.length - 1){
        return data.filter(item => item[attr] === category[1]);
      }else{
        let item = data.find(item => item[attr] === category[1]);
        item.sale = trData.chunk.concat();
      }
    }, this.data);

    localStorage.setItem('dataModel', JSON.stringify(this.data));
  }
}
