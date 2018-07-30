export default class Model{
  constructor(JSONString){
    this.data = JSON.parse(JSONString);
  }
  getSelection(){ // 以后要改为可遍历
    let dataArr = this.data.reduce((dataArr, next) => { // 获取选项
      dataArr[0] = dataArr[0].concat(Object.entries(next));
      dataArr[1] = dataArr[1].concat(Object.keys(next));

      return dataArr;
    }, [[], []]);

    dataArr[1] = [...new Set(dataArr[1])]; // 第一层选项去重

    if(dataArr[1].indexOf('sale') !== -1){ // 去掉 sale 选项
      let idx = dataArr[1].indexOf('sale');
      dataArr[1].splice(idx, 1);
    }

    let selData = dataArr[1].map((selLevel1, idx) => {
      let sel = dataArr[0].reduce((item, next) => {
        if(next[0] === selLevel1){
          item.push(next[1]);
        }
        return item;
      }, []);

      return { // 组合
        name: selLevel1,
        sel: [...new Set(sel)]
      }
    });

    return selData;
  }
  searchData(selItems){
    let self = this;

    if(selItems.product.length === 0 || selItems.region.length === 0) return;

    if(selItems.region.length === 1){
      return pickData([self.data, selItems, ['region', 'product']]);
    }else{
      return pickData([self.data, selItems, ['product', 'region']]);
    }

    function pickData([data, selItems, level]){
      let sortedData = selItems[level[0]].reduce((sortedData, lvItem1) => {
        let obj = selItems[level[1]].reduce((obj, lvItem2) => {
          let item = data.find((item) => {
            return item[level[0]] === lvItem1 && item[level[1]] === lvItem2;
          });
          obj.sel.push({
            name: level[1],
            item: lvItem2,
            sale: item.sale
          });
          return obj;
        }, {name: level[0], item: lvItem1, sel: []});

        sortedData.push(obj);
        return sortedData;
      }, []);

      return sortedData;
    }
  }
}
