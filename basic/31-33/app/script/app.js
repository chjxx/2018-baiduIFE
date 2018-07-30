import '../style/index.scss';
import data from './data.js';
import Model from './model.js';
import Checkbox from './checkbox.js';
import Table from './table.js';



function main(){
  let model = new Model(JSON.stringify(data));
  let checkbox = new Checkbox('.sel_box');
  checkbox.generateElm(model.getSelection());
  let table = new Table('.table_box');

  checkbox.addHandler('datachange', (checkbox) => {
    let seldItems = checkbox.getSeldItems();
    let schData = model.searchData(seldItems);
    table.generateView(schData);
  });
}

main();