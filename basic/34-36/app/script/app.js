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
  });

  table.watch('mouseover', (e) => {
    if(e.target.parentNode.parentNode.tagName === 'TBODY'){
      let data = table.getRowData(e.target.parentNode);

      if(data){
        bar.render(data);
        line.showSingleLine(data);
      };
    }
  });

  table.watch('mouseout', (e) =>{
    if(e.target.parentNode.parentNode.tagName === 'TBODY'){
       line.showAllLine();
    }
  })
}

main();