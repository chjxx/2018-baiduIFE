import '../style/index.scss';
import data from './data.js';
import Model from './model.js';
import Checkbox from './checkbox.js';
import Table from './table.js';
import Bar from './bar.js';
import Line from './line.js';



function main(){
  let model = new Model(JSON.stringify(data));
  let checkbox = new Checkbox('.check-box');
  let table = new Table('.table-box');
  let bar = new Bar('.bar');
  let line = new Line('.line');

  checkbox.render(model.getOptionsData());

  checkbox.watch('changed', (checkbox, history) => {
    let chosenOptionsData = checkbox.getChosenOptionsData();
    let data = model.searchData(chosenOptionsData);

    table.render(data);
    if(!history){ // 不是浏览历史则推入栈中
      pushState(chosenOptionsData);
    }
  });

  table.watch('rendered', (table) =>{
    let data = table.getTableData();

    line.render(data);
    bar.render(data[0]);
  });

  table.watch('mouseover', (e) => {
    let tbody = searchParent(e.target, 'TBODY');
    if(tbody){
      let $tr = searchParent(e.target, 'TR');
      if($tr){
        let data = table.getRowData($tr);
        if(data){
          bar.render(data);
          line.showSingleLine(data);
        };
      }
    }
  });

  table.watch('mouseout', (e) =>{
    let tbody = searchParent(e.target, 'TBODY');
    if(tbody){
       line.showAllLine();
    }
  })

  table.watch('changed', (trData, table) =>{
    let tableData = table.getTableData();

    model.updateData(trData);
    bar.render(trData);
    line.render(tableData);
  });

  window.addEventListener('popstate', data =>{
    let path = location.href.split('?')[1];

    if(path){
      let decodePath = decodeURI(path);

      checkbox.selectOptions(decodePath, true);
    }
  });

  initialPath();

  function initialPath(){
    let defaultPath = 'region=华东&product=手机';
    let [host, path] = location.href.split('?');
    let encodePath;
    if(path){
      encodePath = path;
      path = decodeURI(path);
    }else{
      encodePath = encodeURI(defaultPath);
      path = defaultPath;
    }

    history.replaceState({}, null, `${host}?${encodePath}`);
    checkbox.selectOptions(path, true); // 第二个参数是指是否为历史栈中的页面，true表示是，不再推入历史栈中
  }

  function pushState(chosenOptions){
    let paths = [];

    for(let key in chosenOptions){
      if(chosenOptions.hasOwnProperty(key)){
        let path = `${key}=${chosenOptions[key].join(',')}`;

        paths.push(path);
      }
    }

    let encodePath = encodeURI(paths.join('&'));

    history.pushState({}, null, location.href.split('?')[0] + '?' + encodePath);
  }
}

function searchParent($elm, tagName){
  if($elm){
    if($elm.tagName !== tagName){
      let $parentNode = $elm.parentNode;
      return searchParent($parentNode, tagName);
    }else{
      return $elm;
    }
  }
}

main();