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

  checkbox.watch('changed', (checkbox) => {
    let chosenOptionsData = checkbox.getChosenOptionsData();
    let data = model.searchData(chosenOptionsData);
    table.render(data);
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