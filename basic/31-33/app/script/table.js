const TITLE = { // 给原数据某些属性加中文
  region: '地区',
  product: '商品'
};

export default class Table{
  constructor(id){
    this.$container = document.querySelector(id);

    this.$container.innerHTML = `选项不足......!`;
  }
  generateView(data){
    if(data === undefined){
      this.$container.innerHTML = `选项不足......!`;
    }else{
      this.$container.innerHTML = `<table>
        <thead>${generateTitel(data)}</thead>
        <tbody>${generateBody(data)}</tbody>
      </table>`;
    }
  }
}

let title = [];
function generateTitel(data){
  let title = [];
  let MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  roll(data);

  return generateString();

  function roll(data){
    if(data instanceof Array){
      roll(data[0]);
    }else{
      title.push(TITLE[data.name]);
      if(data.sel instanceof Array){
        roll(data.sel[0]);
      }else{
        if(data.sale !== undefined){
          title = title.concat(MONTHS);
        }
        return;
      }
    }
  }

  function generateString(){
    return title.reduce((str, next) => str + `<th>${next}</th>`, '');
  }
}

function generateBody(data){

  return roll({data: data, root: true});

  function roll({data, root , head}){
    if(data instanceof Array){
      return data.reduce((sumStr, next, idx) =>{
        head = root ? true : (idx === 0 ? false : true);
        return sumStr + roll({data: next, head: head})
     }, '');
    }else{
      if(head){
        if(data.sel instanceof Array){
          return `<tr><td rowspan="${data.sel.length}">${data.item}</td>${roll({data: data.sel})}</tr>`;
        }else if(data.sale instanceof Array){
          return `<tr><td>${data.item}</td>${data.sale.reduce((str, next) => `${str}<td>${next}</td>`, '')}</tr>`;
        }
      }else{
        if(data.sel instanceof Array){
          return `<td rowspan="${data.sel.length}">${data.item}</td>${roll({data: data.sel})}`;
        }else if(data.sale instanceof Array){
          return `<td>${data.item}</td>${data.sale.reduce((str, next) => `${str}<td>${next}</td>`, '')}`;
        }
      }
    }
  }
}